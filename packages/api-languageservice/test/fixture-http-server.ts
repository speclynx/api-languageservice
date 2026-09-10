import net from 'node:net';
import path from 'node:path';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { assert } from 'chai';

import { createHTTPServer, ServerTerminable } from './helpers.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/*
`fetch` and the WHATWG URL parser resolve `..` segments away before a request ever leaves the
client, so a traversal probe has to be written straight onto the socket to reach the server
with its path intact.
 */
const requestRawPath = (port: number, target: string): Promise<{ status: number; raw: string }> =>
  new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1', () => {
      socket.write(
        `GET ${target} HTTP/1.1\r\nHost: 127.0.0.1:${port}\r\nConnection: close\r\n\r\n`,
      );
    });
    let raw = '';
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
      raw += chunk;
    });
    socket.on('error', reject);
    socket.on('close', () => resolve({ status: Number(raw.split(' ')[1]), raw }));
  });

describe('fixture HTTP server', function () {
  const port = 8124;
  const documentRoot = path.join(__dirname, 'fixtures', 'deref');
  let httpServer: ServerTerminable;

  beforeEach(async function () {
    httpServer = createHTTPServer({ port, cwd: documentRoot });
    if (!httpServer.listening) {
      await once(httpServer, 'listening');
    }
  });

  afterEach(async function () {
    await httpServer.terminate();
  });

  specify('should serve a fixture inside the document root', async function () {
    const { status, raw } = await requestRawPath(port, '/petstore31.json');

    assert.strictEqual(status, 200);
    assert.include(raw, '"openapi"');
  });

  specify('should refuse a traversal out of the document root', async function () {
    /*
    Resolves to the package's own package.json, which exists: a server that normalised the
    path without checking containment would answer 200 with its contents.
     */
    const { status } = await requestRawPath(port, '/../../../package.json');

    assert.strictEqual(status, 403);
  });

  specify('should refuse a sibling sharing the document root prefix', async function () {
    /*
    `deref-evil` shares the textual prefix `deref`, so a containment check comparing against
    the root without a trailing separator would admit this path and answer 404 rather than 403.
     */
    const { status } = await requestRawPath(port, '/../deref-evil/secret.json');

    assert.strictEqual(status, 403);
  });

  specify('should report a missing file inside the document root', async function () {
    const { status } = await requestRawPath(port, '/nope.json');

    assert.strictEqual(status, 404);
  });
});
