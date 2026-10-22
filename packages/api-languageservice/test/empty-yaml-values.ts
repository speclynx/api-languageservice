import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';

import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

// Since ApiDOM 6.1.0 the serialized value of an empty YAML node, such as `key:`
// while its value is being typed, is null, while the element stays an empty
// string element. The services read it as the empty string it is typed as.
describe('api-languageservice-empty-yaml-values', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    performanceLogs: logPerformance,
    logLevel,
  };

  it('validates and links a document with an empty $ref', async function () {
    const languageService: LanguageService = getLanguageService(context);
    const document = TextDocument.create(
      'foo://bar/empty-ref.yaml',
      'yaml',
      0,
      "openapi: 3.1.0\ninfo:\n  title: Pets\n  version: 1.0.0\npaths:\n  /pets:\n    get:\n      responses:\n        '200':\n          $ref: \n",
    );

    assert.deepEqual(await languageService.doValidation(document), []);
    assert.deepEqual(await languageService.doLinks(document), [
      { target: '', range: { start: { line: 9, character: 15 }, end: { line: 9, character: 15 } } },
    ]);

    languageService.terminate();
  });

  it('checks the pattern of an empty value', async function () {
    const languageService: LanguageService = getLanguageService(context);
    const document = TextDocument.create(
      'foo://bar/empty-step-id.yaml',
      'yaml',
      0,
      'arazzo: 1.0.1\ninfo:\n  title: Pets\n  version: 1.0.0\nsourceDescriptions:\n  - name: petStore\n    url: https://example.com/openapi.yaml\n    type: openapi\nworkflows:\n  - workflowId: adoptPet\n    steps:\n      - stepId: \n        operationId: getPet\n',
    );

    const diagnostics = await languageService.doValidation(document);

    assert.deepInclude(
      diagnostics.map(({ message, range }) => ({ message, start: range.start })),
      {
        message: 'stepId SHOULD match the pattern [A-Za-z0-9_\\-]+',
        start: { line: 11, character: 15 },
      },
    );

    languageService.terminate();
  });
});
