import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';

import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const validYaml = 'openapi: 3.1.0\ninfo:\n  title: Pets\n  version: 1.0.0\npaths: {}\n';

const nestedYaml = (depth: number): string =>
  `openapi: 3.1.0\n${Array.from({ length: depth }, (_, level) => `${'  '.repeat(level)}nested:`).join('\n')} 1\n`;

describe('api-languageservice-parse-deep-nesting', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    performanceLogs: logPerformance,
    logLevel,
  };

  // Before ApiDOM 6.1.0 the YAML parser shared by every document overflowed its
  // scanner state on a document nested about 253 levels deep, and every later
  // YAML document in the process failed to parse (speclynx/apidom#646): an
  // editor then reported a syntax error in each one until it restarted.
  it('keeps parsing YAML after a deeply nested document', async function () {
    const languageService: LanguageService = getLanguageService(context);

    for (const depth of [100, 200, 250, 256, 260, 300]) {
      await languageService.doValidation(
        TextDocument.create(`foo://bar/nested-${depth}.yaml`, 'yaml', 0, nestedYaml(depth)),
      );
    }
    const diagnostics = await languageService.doValidation(
      TextDocument.create('foo://bar/valid.yaml', 'yaml', 0, validYaml),
    );

    assert.deepEqual(diagnostics, []);

    languageService.terminate();
  });
});
