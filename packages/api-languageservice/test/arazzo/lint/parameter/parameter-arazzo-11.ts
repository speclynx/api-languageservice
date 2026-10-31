import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver-types';

import getLanguageService from '../../../../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../../../../src/apidom-language-types.ts';
import { metadata } from './../../../metadata.ts';
import { logPerformance, logLevel } from './../../../test-utils.ts';
import codes from '../../../../src/config/codes.ts';

// Arazzo document of the given version with one step whose single parameter has the given `in`.
const specTemplate = (version: string, location: string): string => `
arazzo: ${version}
info:
  title: Sample Arazzo Workflow
  version: 1.0.0
sourceDescriptions:
  - name: petStore
    type: openapi
    url: https://example.com/openapi.json
workflows:
  - workflowId: get-pet-workflow
    steps:
      - stepId: find-pets
        operationId: findPets
        parameters:
          - name: filter
            in: ${location}
            value: 'a=1&b=2'
`;

const message10 = "in must be one of: 'path', 'query', 'header', 'cookie'";
const message11 = "in must be one of: 'path', 'query', 'header', 'cookie', 'querystring'";

describe('test-arazzo-linting-parameter-arazzo-11', function () {
  const context: LanguageServiceContext = {
    metadata: metadata(),
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: true,
      referenceValidation: false,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };
  const validationContext: ValidationContext = {
    comments: DiagnosticSeverity.Error,
    maxNumberOfProblems: 100,
    relatedInformation: false,
  };

  const inEqualsDiagnostics = async (version: string, location: string): Promise<Diagnostic[]> => {
    const doc = TextDocument.create(
      'foo://bar/parameter.yaml',
      'yaml',
      0,
      specTemplate(version, location),
    );
    const languageService: LanguageService = getLanguageService(context);
    try {
      const result = await languageService.doValidation(doc, validationContext);
      return result.filter((d) => d.code === codes.ARAZZO_PARAMETER_FIELD_IN_EQUALS);
    } finally {
      languageService.terminate();
    }
  };

  it('accepts in: querystring in Arazzo 1.1.0', async function () {
    assert.deepEqual(await inEqualsDiagnostics('1.1.0', 'querystring'), []);
  });

  it('rejects in: querystring in Arazzo 1.0.0 and 1.0.1', async function () {
    for (const version of ['1.0.0', '1.0.1']) {
      const diagnostics = await inEqualsDiagnostics(version, 'querystring');
      assert.lengthOf(diagnostics, 1, version);
      assert.strictEqual(diagnostics[0].message, message10, version);
      assert.strictEqual(diagnostics[0].severity, DiagnosticSeverity.Error, version);
    }
  });

  it('reports an unknown location once in Arazzo 1.1.0, with the 1.1 message', async function () {
    const diagnostics = await inEqualsDiagnostics('1.1.0', 'body');
    assert.lengthOf(diagnostics, 1);
    assert.strictEqual(diagnostics[0].message, message11);
    assert.strictEqual(diagnostics[0].severity, DiagnosticSeverity.Error);
    assert.deepEqual(diagnostics[0].range, {
      start: { line: 16, character: 16 },
      end: { line: 16, character: 20 },
    });
  });

  it('reports an unknown location once in Arazzo 1.0.1, with the 1.0 message', async function () {
    const diagnostics = await inEqualsDiagnostics('1.0.1', 'body');
    assert.lengthOf(diagnostics, 1);
    assert.strictEqual(diagnostics[0].message, message10);
  });

  it('accepts the four 1.0 locations in both Arazzo 1.0.1 and 1.1.0', async function () {
    for (const version of ['1.0.1', '1.1.0']) {
      for (const location of ['path', 'query', 'header', 'cookie']) {
        assert.deepEqual(
          await inEqualsDiagnostics(version, location),
          [],
          `${version} ${location}`,
        );
      }
    }
  });
});
