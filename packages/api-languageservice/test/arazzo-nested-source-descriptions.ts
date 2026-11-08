import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';

import getLanguageService from '../src/apidom-language-service.ts';
import { LanguageService, LanguageServiceContext } from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(__dirname, 'fixtures', 'arazzo', 'nested-source-descriptions');

// an Arazzo source description with source descriptions of its own made freezing the parsed document throw
describe('arazzo-nested-source-descriptions', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    validationContext: {
      semanticValidation: true,
      referenceValidation: false,
      semanticLinting: true,
    },
    parseContext: {
      fileAllowList: ['*'],
      arazzo: { sourceDescriptionsResolution: true },
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  for (const fixture of ['cycle-a.arazzo.yaml', 'chain-a.arazzo.yaml']) {
    it(`validates ${fixture}`, async function () {
      const filePath = path.join(fixtures, fixture);
      const doc = TextDocument.create(
        pathToFileURL(filePath).toString(),
        'yaml',
        0,
        fs.readFileSync(filePath, 'utf8'),
      );
      const languageService: LanguageService = getLanguageService(context);

      try {
        const result = await languageService.doValidation(doc);
        assert.isArray(result);
      } finally {
        languageService.terminate();
      }
    });
  }
});
