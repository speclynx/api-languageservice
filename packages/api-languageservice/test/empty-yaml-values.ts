import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';

import getLanguageService from '../src/apidom-language-service.ts';
import { Format, LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

// ApiDOM parses an empty YAML node, such as `key:` while its value is being
// typed, as a null element, whose value is null. The services read it as null:
// it is no reference and no string, and completion proposes every value at it.
describe('api-languageservice-empty-yaml-values', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    performanceLogs: logPerformance,
    logLevel,
  };

  it('reports an empty $ref and gives it no link', async function () {
    const languageService: LanguageService = getLanguageService(context);
    const document = TextDocument.create(
      'foo://bar/empty-ref.yaml',
      'yaml',
      0,
      "openapi: 3.1.0\ninfo:\n  title: Pets\n  version: 1.0.0\npaths:\n  /pets:\n    get:\n      responses:\n        '200':\n          $ref: \n",
    );

    const diagnostics = await languageService.doValidation(document);

    assert.deepEqual(
      diagnostics.map(({ message, range }) => ({ message, start: range.start })),
      [
        {
          message: "'$ref' value must be a valid URI-reference",
          start: { line: 9, character: 15 },
        },
      ],
    );
    assert.deepEqual(await languageService.doLinks(document), []);

    languageService.terminate();
  });

  it('dereferences a document whose first server has no url', async function () {
    const languageService: LanguageService = getLanguageService(context);
    const components =
      "components:\n  schemas:\n    A:\n      $ref: '#/components/schemas/B'\n    B:\n      type: string\n";
    const documents = {
      'asyncapi-empty-url': `asyncapi: 2.6.0\ninfo:\n  title: Pets\n  version: 1.0.0\nservers:\n  prod:\n    url: \n    protocol: mqtt\nchannels: {}\n${components}`,
      'asyncapi-empty-server': `asyncapi: 2.6.0\ninfo:\n  title: Pets\n  version: 1.0.0\nservers:\n  prod: \nchannels: {}\n${components}`,
      'openapi-empty-url': `openapi: 3.0.3\ninfo:\n  title: Pets\n  version: 1.0.0\nservers:\n  - url: \npaths: {}\n${components}`,
      'openapi-empty-server': `openapi: 3.0.3\ninfo:\n  title: Pets\n  version: 1.0.0\nservers:\n  - \npaths: {}\n${components}`,
      'openapi-no-url': `openapi: 3.0.3\ninfo:\n  title: Pets\n  version: 1.0.0\nservers:\n  - description: Production\npaths: {}\n${components}`,
    };

    for (const [name, text] of Object.entries(documents)) {
      const document = TextDocument.create(`foo://bar/${name}.yaml`, 'yaml', 0, text);
      const dereferenced = JSON.parse(
        await languageService.doDeref(document, { format: Format.JSON }),
      );

      assert.deepEqual(dereferenced.components.schemas.A, { type: 'string' }, name);
    }

    languageService.terminate();
  });

  it('reports an empty value where a string is expected', async function () {
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
        message: 'stepId must be a string',
        start: { line: 11, character: 15 },
      },
    );

    languageService.terminate();
  });

  it('proposes null at an empty value', async function () {
    const languageService: LanguageService = getLanguageService(context);
    const document = TextDocument.create(
      'foo://bar/empty-type.yaml',
      'yaml',
      0,
      'asyncapi: 2.6.0\ninfo:\n  title: Pets\n  version: 1.0.0\nchannels: {}\ncomponents:\n  schemas:\n    Pet:\n      type: \n',
    );

    const completion = await languageService.doCompletion(document, { line: 8, character: 12 });

    assert.include(
      (completion?.items ?? []).map(({ label }) => label),
      'null',
    );

    languageService.terminate();
  });
});
