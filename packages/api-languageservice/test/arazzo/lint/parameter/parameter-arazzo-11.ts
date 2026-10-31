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

// Where the template puts the value of `in`.
const inLine = 16;
const inCharacter = 16;

const message10 = "in must be one of: 'path', 'query', 'header', 'cookie'";
const message11 = "in must be one of: 'path', 'query', 'header', 'cookie', 'querystring'";

// Patch versions beyond the enumerated ones pin that both variants target the `x` specs.
const versions10 = ['1.0.0', '1.0.1', '1.0.2'];
const versions11 = ['1.1.0', '1.1.1'];
const locations10 = ['path', 'query', 'header', 'cookie'];

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

  const diagnosticsWithCode = async (
    version: string,
    location: string,
    code: number,
  ): Promise<Diagnostic[]> => {
    const doc = TextDocument.create(
      'foo://bar/parameter.yaml',
      'yaml',
      0,
      specTemplate(version, location),
    );
    const languageService: LanguageService = getLanguageService(context);
    try {
      const result = await languageService.doValidation(doc, validationContext);
      return result.filter((d) => d.code === code);
    } finally {
      languageService.terminate();
    }
  };

  const inEqualsDiagnostics = (version: string, location: string): Promise<Diagnostic[]> =>
    diagnosticsWithCode(version, location, codes.ARAZZO_PARAMETER_FIELD_IN_EQUALS);

  // Exactly one diagnostic, as an error with the given message, on the value of `in`.
  const assertOneInEquals = (diagnostics: Diagnostic[], message: string, location: string) => {
    assert.lengthOf(diagnostics, 1);
    assert.strictEqual(diagnostics[0].message, message);
    assert.strictEqual(diagnostics[0].severity, DiagnosticSeverity.Error);
    assert.deepEqual(diagnostics[0].range, {
      start: { line: inLine, character: inCharacter },
      end: { line: inLine, character: inCharacter + location.length },
    });
  };

  versions11.forEach((version) => {
    specify(`accepts in: querystring in Arazzo ${version}`, async function () {
      assert.deepEqual(await inEqualsDiagnostics(version, 'querystring'), []);
    });

    specify(
      `reports an unknown location in Arazzo ${version} once, with the 1.1 message`,
      async function () {
        assertOneInEquals(await inEqualsDiagnostics(version, 'body'), message11, 'body');
      },
    );

    // The Arazzo 1.1 JSON Schema also allows `channel`, but the specification lists only the
    // five locations, which the rule follows.
    specify(`reports in: channel in Arazzo ${version}`, async function () {
      assertOneInEquals(await inEqualsDiagnostics(version, 'channel'), message11, 'channel');
    });
  });

  versions10.forEach((version) => {
    specify(
      `reports in: querystring in Arazzo ${version} once, with the 1.0 message`,
      async function () {
        assertOneInEquals(
          await inEqualsDiagnostics(version, 'querystring'),
          message10,
          'querystring',
        );
      },
    );

    specify(
      `reports an unknown location in Arazzo ${version} once, with the 1.0 message`,
      async function () {
        assertOneInEquals(await inEqualsDiagnostics(version, 'body'), message10, 'body');
      },
    );
  });

  [...versions10, ...versions11].forEach((version) => {
    locations10.forEach((location) => {
      specify(`accepts in: ${location} in Arazzo ${version}`, async function () {
        assert.deepEqual(await inEqualsDiagnostics(version, location), []);
      });
    });
  });

  // A value that isn't a string is the type rule's to report. A list of valid locations passes
  // the location rule, so the type rule is all that reports it.
  ['1.0.1', '1.1.0'].forEach((version) => {
    specify(`reports in: [query] in Arazzo ${version} as not a string only`, async function () {
      assert.deepEqual(await inEqualsDiagnostics(version, '[query]'), []);
      const typeDiagnostics = await diagnosticsWithCode(
        version,
        '[query]',
        codes.ARAZZO_PARAMETER_FIELD_IN_TYPE,
      );
      assert.lengthOf(typeDiagnostics, 1);
      assert.strictEqual(typeDiagnostics[0].message, 'in must be a string');
    });

    specify(
      `reports in: 5 in Arazzo ${version} as not a string and not a location`,
      async function () {
        const message = version === '1.0.1' ? message10 : message11;
        assertOneInEquals(await inEqualsDiagnostics(version, '5'), message, '5');
        const typeDiagnostics = await diagnosticsWithCode(
          version,
          '5',
          codes.ARAZZO_PARAMETER_FIELD_IN_TYPE,
        );
        assert.lengthOf(typeDiagnostics, 1);
      },
    );
  });
});
