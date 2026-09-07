import fs from 'node:fs';
import path from 'node:path';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element } from '@speclynx/apidom-datamodel';
import { type Path, forEach } from '@speclynx/apidom-traverse';
import { fileURLToPath } from 'node:url';

import { parse } from '../src/parser-factory.ts';
import { getSourceMap, SourceMap } from '../src/utils/utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const spec = fs.readFileSync(path.join(__dirname, 'fixtures', 'async-empty.yaml')).toString();

describe('api-languageservice-parse-empty', function () {
  it('test parse empty lines async', async function () {
    // valid spec
    const doc: TextDocument = TextDocument.create('foo://bar/spec.json', 'json', 0, spec);

    parse(doc, undefined).then((result) => {
      const { api } = result;
      if (!api) {
        return;
      }
      api.freeze(); // !! freeze and add parent !!

      function printSourceMap(path: Path<Element>): void {
        const node = path.node;
        const sm: SourceMap = getSourceMap(node);

        console.log(node.element, `${sm.line}:${sm.column} - ${sm.endLine}:${sm.endColumn}`);
      }

      // forEach(api, printSourceMap);
      forEach(api, printSourceMap);

      // offset related
      /*
      const pos = Position.create(1, 6);
      const offset = doc.offsetAt(pos);
      // find the current node
      const node: Element = findAtOffset({ offset, includeRightBound: true }, api);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sm = getSourceMap(node as Element);
      printSourceMap(node);

       */
    });
  });
});
