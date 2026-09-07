import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DefinitionParams } from 'vscode-languageserver-protocol';
import { Position, Range } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specPath: string = path.join(__dirname, 'fixtures', 'deref/ext/root.json');
const spec = fs.readFileSync(specPath).toString();
const specPathYaml: string = path.join(__dirname, 'fixtures', 'deref/ext/root.yaml');
const specYaml = fs.readFileSync(specPathYaml).toString();

const defTestInput = [
  [
    'ref value',
    10,
    25,
    {
      end: {
        character: 3,
        line: 6,
      },
      start: {
        character: 23,
        line: 1,
      },
    },
  ],
];

const defTestInputYaml = [
  [
    'ref value',
    7,
    24,
    {
      end: {
        character: 3,
        line: 6,
      },
      start: {
        character: 23,
        line: 1,
      },
    },
  ],
];

describe('api-languageservice-definition', function () {
  const context: LanguageServiceContext = {
    performanceLogs: logPerformance,
    logLevel,
  };

  const languageService: LanguageService = getLanguageService(context);

  after(function () {
    languageService.terminate();
  });

  it('test external ref go to definition', async function () {
    const doc: TextDocument = TextDocument.create(specPath, 'apidom', 0, spec);

    for (const input of defTestInput) {
      console.log(`testing def for ${input[0]}`);
      const pos = Position.create(input[1] as number, input[2] as number);
      const definitionParams: DefinitionParams = {
        position: pos,
        textDocument: doc,
      };

      const result = await languageService.doProvideDefinition(doc, definitionParams);

      console.log('external def result', JSON.stringify(result, null, 2));
      assert.deepEqual(result!.range, input[3] as Range);
      assert.isTrue(result!.uri!.endsWith('ex.json'));
    }
  });

  it('test external ref go to definition YAML->JSON', async function () {
    const doc: TextDocument = TextDocument.create(specPathYaml, 'apidom', 0, specYaml);

    for (const input of defTestInputYaml) {
      console.log(`testing YAML def for ${input[0]}`);
      const pos = Position.create(input[1] as number, input[2] as number);
      const definitionParams: DefinitionParams = {
        position: pos,
        textDocument: doc,
      };

      const result = await languageService.doProvideDefinition(doc, definitionParams);

      console.log('external def result', JSON.stringify(result, null, 2));
      assert.deepEqual(result!.range, input[3] as Range);
      assert.isTrue(result!.uri!.endsWith('ex.json'));
    }
  });
});
