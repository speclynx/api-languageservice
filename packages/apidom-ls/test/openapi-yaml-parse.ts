import fs from 'node:fs';
import path from 'node:path';
import { TextDocument } from 'vscode-languageserver-textdocument';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Diagnostic, Position } from 'vscode-languageserver-types';
import {
  Element,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMemberElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isObjectElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isStringElement,
} from '@speclynx/apidom-datamodel';
import { forEach } from '@speclynx/apidom-traverse';

import { toValue } from '@speclynx/apidom-core';
import { fileURLToPath } from 'node:url';

import { parse } from '../src/parser-factory.ts';
import { getSourceMap, SourceMap } from '../src/utils/utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const spec = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-api.yaml')).toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specCompletion = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-completion.yaml'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specCompletionJson = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-completion.json'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specError = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-error.yaml'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specErrorJson = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-error.json'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specSimple = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-simple.yaml'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specErrorSimple = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-error-simple.yaml'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specErrorSimpleJson = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'sample-api-error-simple.json'))
  .toString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specSyntaxYaml = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'syntax/sample-api.yaml'))
  .toString();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specSyntaxYamlNoQuotes = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'syntax/sample-api-noquotes-sort.yaml'))
  .toString();

const specSyntaxYamlNoQuotesAsync = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'syntax/sample-api-async-noquotes.yaml'))
  .toString();

describe('apidom-parse-test', function () {
  it('test parse yaml', async function () {
    const doc: TextDocument = TextDocument.create(
      'foo://bar/file.yaml',
      'yaml',
      0,
      specSyntaxYamlNoQuotesAsync,
    );

    const diagnostics: Diagnostic[] = [];

    parse(doc, undefined).then((result) => {
      const { api } = result;
      if (!api) {
        return diagnostics;
      }
      api.freeze(); // !! freeze and add parent !!

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function printSourceMap(node: Element): void {
        const sm: SourceMap = getSourceMap(node);

        console.log(node.element, `${sm.line}:${sm.column} - ${sm.endLine}:${sm.endColumn}`);
      }

      function printContent(node: Element): void {
        const sm: SourceMap = getSourceMap(node);

        console.log(
          node.element,
          toValue(node.getMetaProperty('classes', [])),
          `[${sm.offset} / ${sm.line}:${sm.column} - ${sm.endLine}:${sm.endColumn}]`,
          toValue(node),
        );
      }

      // forEach(api, printSourceMap);
      // printContent(api);
      forEach(api, printContent);

      if (result.annotations) {
        for (const annotation of result.annotations) {
          console.log(JSON.stringify(annotation));
        }
      }

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
