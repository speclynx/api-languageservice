import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  DiagnosticCategory,
  LanguageService,
  LanguageServiceContext,
  LinterMeta,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { metadata } from './metadata.ts';
import { OpenAPi31JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-31-json-schema-validation-provider.ts';
import { OpenAPi30JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-30-json-schema-validation-provider.ts';
import { OpenAPi20JsonSchemaValidationProvider } from '../src/services/validation/providers/openapi-20-json-schema-validation-provider.ts';
import { logLevel, logPerformance } from './test-utils.ts';
import ApilintCodes from '../src/config/codes.ts';
import { OpenAPI3 } from '../src/config/openapi/target-specs.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specOpenapiSimple = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'ajv-simple-api.json'))
  .toString();

const specOpenapiSimpleLint = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'ajv-simple-api-lint.json'))
  .toString();

const specOpenapiSimple30 = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'ajv-simple-api-30.json'))
  .toString();

const specOpenapiSimple20 = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'ajv-simple-api-20.json'))
  .toString();

describe('apidom-ls-validate-jsonschema', function () {
  const oasJsonSchemavalidationProvider = new OpenAPi31JsonSchemaValidationProvider();
  const oasJsonSchemavalidationProvider30 = new OpenAPi30JsonSchemaValidationProvider();
  const oasJsonSchemavalidationProvider20 = new OpenAPi20JsonSchemaValidationProvider();
  const oasJsonSchemavalidationProviderOverride = new OpenAPi31JsonSchemaValidationProvider();
  const oasJsonSchemavalidationProvider30Override = new OpenAPi30JsonSchemaValidationProvider();
  const oasJsonSchemavalidationProvider20Override = new OpenAPi20JsonSchemaValidationProvider();
  oasJsonSchemavalidationProviderOverride.setOverrideDefaultValidation(true);
  oasJsonSchemavalidationProvider30Override.setOverrideDefaultValidation(true);
  oasJsonSchemavalidationProvider20Override.setOverrideDefaultValidation(true);

  const requestBodyTentativelyAllowedLint: LinterMeta = {
    code: ApilintCodes.OPENAPI3_0_OPERATION_FIELD_REQUEST_BODY_TENTATIVELY_ALLOWED,
    source: 'apilint',
    message: 'requestBody does not have well-defined semantics for GET, HEAD and DELETE operations',
    severity: DiagnosticSeverity.Warning,
    linterFunction: 'apilintOperationRequestBodyAllowed',
    linterParams: [['PUT', 'POST', 'PATCH', 'OPTIONS', 'TRACE']],
    marker: 'key',
    markerTarget: 'requestBody',
    target: 'requestBody',
    data: {},
    category: DiagnosticCategory.LINT,
    targetSpecs: OpenAPI3,
  };

  const metadataLint = JSON.parse(JSON.stringify(metadata()));
  metadataLint.metadataMaps.openapi.operation.lint.push(requestBodyTentativelyAllowedLint);

  const context: LanguageServiceContext = {
    metadata: metadata(),
    validatorProviders: [oasJsonSchemavalidationProvider],
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: true,
      referenceValidation: true,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };
  const contextOverride: LanguageServiceContext = {
    metadata: metadata(),
    validatorProviders: [oasJsonSchemavalidationProviderOverride],
    performanceLogs: logPerformance,
    logLevel,
  };

  const contextSchemaOnly: LanguageServiceContext = {
    metadata: metadata(),
    validatorProviders: [
      oasJsonSchemavalidationProviderOverride,
      oasJsonSchemavalidationProvider30Override,
      oasJsonSchemavalidationProvider20Override,
    ],
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: false,
      referenceValidation: false,
      semanticLinting: false,
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  const contextSchemaAndSemanticLintAndRef: LanguageServiceContext = {
    metadata: metadataLint,
    validatorProviders: [
      oasJsonSchemavalidationProvider,
      oasJsonSchemavalidationProvider30,
      oasJsonSchemavalidationProvider20,
    ],
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: false,
      referenceValidation: true,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  const metadataNoTitle = JSON.parse(JSON.stringify(metadata()));
  metadataNoTitle.metadataMaps.asyncapi.info.lint.splice(3, 1);

  const context30: LanguageServiceContext = {
    metadata: metadata(),
    validatorProviders: [oasJsonSchemavalidationProvider30],
    validationContext: {
      jsonSchemaValidation: true,
      semanticValidation: true,
      referenceValidation: true,
      semanticLinting: true,
    },
    performanceLogs: logPerformance,
    logLevel,
  };

  it('test validation for openapi with schema', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/openapi.json',
      'specOpenapiSimple',
      0,
      specOpenapiSimple,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOpenapi, validationContext);
    const expected = [
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "must have required property 'title'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 18,
            character: 18,
          },
          end: {
            line: 18,
            character: 24,
          },
        },
        message: 'must be equal to one of the allowed values',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 19,
            character: 18,
          },
          end: {
            line: 19,
            character: 36,
          },
        },
        message: 'must be number',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "should always have a 'title'",
        severity: 1,
        code: 5020101,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "add 'title' field",
              action: 'addChild',
              snippetYaml: 'title: \n  ',
              snippetJson: '"title": "",\n    ',
            },
          ],
        },
      },
      {
        range: {
          start: {
            line: 19,
            character: 38,
          },
          end: {
            line: 19,
            character: 42,
          },
        },
        message: "'exclusiveMaximum' value must be a number",
        severity: 1,
        code: 10016,
        source: 'apilint',
        data: {},
      },
      {
        range: {
          start: {
            line: 18,
            character: 26,
          },
          end: {
            line: 18,
            character: 35,
          },
        },
        message: 'type must be one of allowed values',
        severity: 1,
        code: 10001,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "update to 'null'",
              action: 'updateValue',
              functionParams: ['null'],
            },
            {
              message: "update to 'boolean'",
              action: 'updateValue',
              functionParams: ['boolean'],
            },
            {
              message: "update to 'object'",
              action: 'updateValue',
              functionParams: ['object'],
            },
            {
              message: "update to 'array'",
              action: 'updateValue',
              functionParams: ['array'],
            },
            {
              message: "update to 'number'",
              action: 'updateValue',
              functionParams: ['null'],
            },
            {
              message: "update to 'string'",
              action: 'updateValue',
              functionParams: ['string'],
            },
            {
              message: "update to 'integer'",
              action: 'updateValue',
              functionParams: ['integer'],
            },
          ],
        },
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);

    languageService.terminate();
  });

  it('test validation for openapi 2.0 with schema', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/openapi.json',
      'specOpenapiSimple',
      0,
      specOpenapiSimple20,
    );

    const languageService: LanguageService = getLanguageService(contextSchemaOnly);

    const result = await languageService.doValidation(docOpenapi, validationContext);
    const expected = [
      {
        range: {
          start: {
            line: 5,
            character: 4,
          },
          end: {
            line: 5,
            character: 11,
          },
        },
        message: 'must be string',
        severity: 1,
        code: 0,
        source: 'OpenAPI 2.0 Schema',
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);

    languageService.terminate();
  });

  it('test validation for openapi with schema and better errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
      betterAjvErrors: true,
    };

    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/openapi.json',
      'specOpenapiSimple',
      0,
      specOpenapiSimple,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOpenapi, validationContext);
    const expected = [
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: '"info" property must have required property "title"',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 19,
            character: 18,
          },
          end: {
            line: 19,
            character: 36,
          },
        },
        message: '"exclusiveMaximum" property type must be number',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "should always have a 'title'",
        severity: 1,
        code: 5020101,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "add 'title' field",
              action: 'addChild',
              snippetYaml: 'title: \n  ',
              snippetJson: '"title": "",\n    ',
            },
          ],
        },
      },
      {
        range: {
          start: {
            line: 19,
            character: 38,
          },
          end: {
            line: 19,
            character: 42,
          },
        },
        message: "'exclusiveMaximum' value must be a number",
        severity: 1,
        code: 10016,
        source: 'apilint',
        data: {},
      },
      {
        range: {
          start: {
            line: 18,
            character: 26,
          },
          end: {
            line: 18,
            character: 35,
          },
        },
        message: 'type must be one of allowed values',
        severity: 1,
        code: 10001,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "update to 'null'",
              action: 'updateValue',
              functionParams: ['null'],
            },
            {
              message: "update to 'boolean'",
              action: 'updateValue',
              functionParams: ['boolean'],
            },
            {
              message: "update to 'object'",
              action: 'updateValue',
              functionParams: ['object'],
            },
            {
              message: "update to 'array'",
              action: 'updateValue',
              functionParams: ['array'],
            },
            {
              message: "update to 'number'",
              action: 'updateValue',
              functionParams: ['null'],
            },
            {
              message: "update to 'string'",
              action: 'updateValue',
              functionParams: ['string'],
            },
            {
              message: "update to 'integer'",
              action: 'updateValue',
              functionParams: ['integer'],
            },
          ],
        },
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);

    languageService.terminate();
  });

  it('test validation for openapi with schema only', async function () {
    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/openapi.json',
      'specOpenapiSimple',
      0,
      specOpenapiSimple,
    );

    const languageService: LanguageService = getLanguageService(contextSchemaOnly);

    const result = await languageService.doValidation(docOpenapi);
    const expected = [
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "must have required property 'title'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 18,
            character: 18,
          },
          end: {
            line: 18,
            character: 24,
          },
        },
        message: 'must be equal to one of the allowed values',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 19,
            character: 18,
          },
          end: {
            line: 19,
            character: 36,
          },
        },
        message: 'must be number',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);

    languageService.terminate();
  });

  it('test validation for openapi with schema and Ref and Lint', async function () {
    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/openapi.json',
      'specOpenapiSimple',
      0,
      specOpenapiSimpleLint,
    );

    const languageService: LanguageService = getLanguageService(contextSchemaAndSemanticLintAndRef);

    const result = await languageService.doValidation(docOpenapi);
    const expected = [
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "must have required property 'title'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 27,
            character: 18,
          },
          end: {
            line: 27,
            character: 24,
          },
        },
        message: 'must be equal to one of the allowed values',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 28,
            character: 18,
          },
          end: {
            line: 28,
            character: 36,
          },
        },
        message: 'must be number',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 12,
            character: 8,
          },
          end: {
            line: 12,
            character: 21,
          },
        },
        message:
          'requestBody does not have well-defined semantics for GET, HEAD and DELETE operations',
        severity: 2,
        code: 5130702,
        source: 'apilint',
        data: {},
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);

    languageService.terminate();
  });

  it('test validation for openapi with overriding schema', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/openapi.json',
      'specOpenapiSimple',
      0,
      specOpenapiSimple,
    );

    const languageService: LanguageService = getLanguageService(contextOverride);

    const result = await languageService.doValidation(docOpenapi, validationContext);
    const expected = [
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "must have required property 'title'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 18,
            character: 18,
          },
          end: {
            line: 18,
            character: 24,
          },
        },
        message: 'must be equal to one of the allowed values',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
      {
        range: {
          start: {
            line: 19,
            character: 18,
          },
          end: {
            line: 19,
            character: 36,
          },
        },
        message: 'must be number',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.1 Schema',
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);

    languageService.terminate();
  });

  it('test validation for openapi with modified 3.0 schema', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    // valid spec
    const docOpenapi: TextDocument = TextDocument.create(
      'foo://bar/specOpenapiSimple30.json',
      'json',
      0,
      specOpenapiSimple30,
    );

    const languageService: LanguageService = getLanguageService(context30);

    const result = await languageService.doValidation(docOpenapi, validationContext);
    const expected = [
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "must have required property 'title'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.0 Schema',
      },
      {
        range: {
          start: {
            line: 19,
            character: 18,
          },
          end: {
            line: 19,
            character: 36,
          },
        },
        message: 'must be boolean',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.0 Schema',
      },
      {
        range: {
          start: {
            line: 18,
            character: 18,
          },
          end: {
            line: 18,
            character: 24,
          },
        },
        message: 'must be equal to one of the allowed values',
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.0 Schema',
      },
      {
        range: {
          start: {
            line: 26,
            character: 6,
          },
          end: {
            line: 26,
            character: 12,
          },
        },
        message: "must have required property 'responses'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.0 Schema',
      },
      {
        range: {
          start: {
            line: 31,
            character: 6,
          },
          end: {
            line: 31,
            character: 12,
          },
        },
        message: "must have required property 'responses'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.0 Schema',
      },
      {
        range: {
          start: {
            line: 36,
            character: 6,
          },
          end: {
            line: 36,
            character: 11,
          },
        },
        message: "must have required property 'responses'",
        severity: 1,
        code: 0,
        source: 'OpenAPI 3.0 Schema',
      },
      {
        range: {
          start: {
            line: 2,
            character: 2,
          },
          end: {
            line: 2,
            character: 8,
          },
        },
        message: "should always have a 'title'",
        severity: 1,
        code: 5020101,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "add 'title' field",
              action: 'addChild',
              snippetYaml: 'title: \n  ',
              snippetJson: '"title": "",\n    ',
            },
          ],
        },
      },
      {
        range: {
          start: {
            line: 19,
            character: 38,
          },
          end: {
            line: 19,
            character: 42,
          },
        },
        message: "'exclusiveMaximum' value must be a boolean",
        severity: 1,
        code: 10016,
        source: 'apilint',
        data: {},
      },
      {
        range: {
          start: {
            line: 18,
            character: 26,
          },
          end: {
            line: 18,
            character: 35,
          },
        },
        message: 'type must be one of allowed values',
        severity: 1,
        code: 10001,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "update to 'boolean'",
              action: 'updateValue',
              functionParams: ['boolean'],
            },
            {
              message: "update to 'object'",
              action: 'updateValue',
              functionParams: ['object'],
            },
            {
              message: "update to 'array'",
              action: 'updateValue',
              functionParams: ['array'],
            },
            {
              message: "update to 'number'",
              action: 'updateValue',
              functionParams: ['null'],
            },
            {
              message: "update to 'string'",
              action: 'updateValue',
              functionParams: ['string'],
            },
            {
              message: "update to 'integer'",
              action: 'updateValue',
              functionParams: ['integer'],
            },
          ],
        },
      },
      {
        range: {
          start: {
            line: 26,
            character: 6,
          },
          end: {
            line: 26,
            character: 12,
          },
        },
        message: "should always have a 'responses'",
        severity: 1,
        code: 3081001,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "add 'responses' field",
              action: 'addChild',
              snippetYaml: 'responses: \n  ',
              snippetJson: '"responses": {},\n    ',
            },
          ],
        },
      },
      {
        range: {
          start: {
            line: 31,
            character: 6,
          },
          end: {
            line: 31,
            character: 12,
          },
        },
        message: "should always have a 'responses'",
        severity: 1,
        code: 3081001,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "add 'responses' field",
              action: 'addChild',
              snippetYaml: 'responses: \n  ',
              snippetJson: '"responses": {},\n    ',
            },
          ],
        },
      },
      {
        range: {
          start: {
            line: 36,
            character: 6,
          },
          end: {
            line: 36,
            character: 11,
          },
        },
        message: "should always have a 'responses'",
        severity: 1,
        code: 3081001,
        source: 'apilint',
        data: {
          quickFix: [
            {
              message: "add 'responses' field",
              action: 'addChild',
              snippetYaml: 'responses: \n  ',
              snippetJson: '"responses": {},\n    ',
            },
          ],
        },
      },
    ];
    assert.deepEqual(result, expected as Diagnostic[]);
    languageService.terminate();
  });
});
