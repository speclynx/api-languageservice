import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ReferenceParams } from 'vscode-languageserver-protocol';

import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logLevel, logPerformance } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const spec = fs.readFileSync(path.join(__dirname, 'fixtures', 'openapi.yaml')).toString();

describe('find references', function () {
  const lsContext: LanguageServiceContext = {
    metadata: metadata(),
    validatorProviders: [],
    performanceLogs: logPerformance,
    logLevel,
  };

  const languageService: LanguageService = getLanguageService(lsContext);

  context('given doc with references', function () {
    specify('should find references', async function () {
      const doc: TextDocument = TextDocument.create('foo://bar/references.yaml', 'yaml', 0, spec);
      const offset = doc.offsetAt({ line: 166, character: 7 });
      // localReferencePointers(doc, httpPort, true);
      const params: ReferenceParams = {
        textDocument: { uri: doc.uri },
        position: doc.positionAt(offset),
        context: {
          includeDeclaration: true,
        },
      };
      const locations = await languageService.doProvideReferences(doc, params);
      const expected = [
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 225,
              character: 12,
            },
            end: {
              line: 225,
              character: 44,
            },
          },
        },
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 222,
              character: 12,
            },
            end: {
              line: 222,
              character: 44,
            },
          },
        },
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 56,
              character: 14,
            },
            end: {
              line: 56,
              character: 46,
            },
          },
        },
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 53,
              character: 14,
            },
            end: {
              line: 53,
              character: 46,
            },
          },
        },
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 50,
              character: 14,
            },
            end: {
              line: 50,
              character: 46,
            },
          },
        },
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 67,
              character: 16,
            },
            end: {
              line: 67,
              character: 48,
            },
          },
        },
        {
          uri: 'foo://bar/references.yaml',
          range: {
            start: {
              line: 64,
              character: 16,
            },
            end: {
              line: 64,
              character: 48,
            },
          },
        },
      ];
      assert.deepEqual(locations, expected);
      languageService.terminate();
    });
  });
});
