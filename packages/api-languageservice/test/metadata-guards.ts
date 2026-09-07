import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  Metadata,
  MetadataMap,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { logPerformance, logLevel } from './test-utils.ts';

// https://github.com/speclynx/apidom-internal/issues/191
describe('apidom-ls-metadata-guards', function () {
  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
    semanticLinting: true,
  };

  const specArazzo = "arazzo: '1.0.1'\ninfo: {title: t, version: '1.0.0'}";

  it('does not throw when custom metadata omits linterFunctions entirely', async function () {
    const metadataMap: MetadataMap = {
      info: {
        lint: [
          {
            code: 999001,
            source: 'apilint',
            message: 'custom rule fired',
            severity: 1,
            linterFunction: 'myCustomFn',
            target: 'title',
            marker: 'value',
          },
        ],
      },
    };

    // deliberately missing linterFunctions/symbols/tokens, mirroring a consumer
    // supplying a partial custom metadata object
    const partialMetadata = {
      metadataMaps: { arazzo: metadataMap },
    } as unknown as Metadata;

    const context: LanguageServiceContext = {
      metadata: partialMetadata,
      performanceLogs: logPerformance,
      logLevel,
      validationContext,
    };

    const doc = TextDocument.create('foo://bar/arazzo.yaml', 'yaml', 0, specArazzo);
    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(doc, validationContext);

    // the rule's linterFunction cannot be resolved (neither standard nor
    // registered), so it is silently skipped rather than throwing, and no
    // diagnostic with its code is produced
    assert.isArray(result);
    assert.isUndefined(result.find((diagnostic) => diagnostic.code === 999001));

    languageService.terminate();
  });

  it('treats an unresolvable condition function as failed rather than passed', async function () {
    const metadataMap: MetadataMap = {
      info: {
        lint: [
          {
            code: 999002,
            source: 'apilint',
            message: 'should never fire because its condition cannot be resolved',
            severity: 1,
            linterFunction: 'alwaysFail',
            target: 'title',
            marker: 'value',
            conditions: [
              {
                function: 'thisConditionFunctionDoesNotExistAnywhere',
              },
            ],
          },
        ],
      },
    };

    const metadata: Metadata = {
      metadataMaps: { arazzo: metadataMap },
      linterFunctions: {
        arazzo: {
          // always reports a violation when the rule actually runs, so a
          // fired diagnostic proves the (unresolvable) condition was
          // incorrectly treated as passed
          alwaysFail: () => false,
        },
      },
      symbols: [],
      tokens: [],
    };

    const context: LanguageServiceContext = {
      metadata,
      performanceLogs: logPerformance,
      logLevel,
      validationContext,
    };

    const doc = TextDocument.create('foo://bar/arazzo.yaml', 'yaml', 0, specArazzo);
    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(doc, validationContext);

    assert.isUndefined(result.find((diagnostic) => diagnostic.code === 999002));

    languageService.terminate();
  });
});
