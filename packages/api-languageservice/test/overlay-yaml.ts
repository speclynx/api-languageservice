import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../src/apidom-language-service.ts';
import {
  Format,
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../src/apidom-language-types.ts';
import { findNamespace } from '../src/utils/utils.ts';
import { Overlay1JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-1-json-schema-validation-provider.ts';
import { Overlay10JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-10-json-schema-validation-provider.ts';
import { Overlay11JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-11-json-schema-validation-provider.ts';
import { Overlay12JsonSchemaValidationProvider } from '../src/services/validation/providers/overlay-12-json-schema-validation-provider.ts';
import { metadata } from './metadata.ts';
import { logPerformance, logLevel, diagnosticText } from './test-utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const specOverlayYaml = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'overlay', 'sample-overlay.yaml'))
  .toString();

const specOverlay12Yaml = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'overlay', 'sample-overlay-1-2.yaml'))
  .toString();

const specOverlay10Yaml = `overlay: "1.0.0"
info:
  title: Overlay for 1.0
  version: "1.0.0"
actions:
  - target: "$.paths['/users'].get"
    update:
      description: Returns a list of users
`;

describe('api-languageservice-overlay-yaml', function () {
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

  it('test namespace detection for overlay 1.1.0 yaml', async function () {
    const contentLanguage = await findNamespace(specOverlayYaml);

    assert.strictEqual(contentLanguage.namespace, 'overlay');
    assert.strictEqual(contentLanguage.version, '1.1.0');
    assert.strictEqual(contentLanguage.format, 'YAML');
    assert.strictEqual(contentLanguage.mediaType, 'application/vnd.oai.overlay+yaml;version=1.1.0');
  });

  it('test validation for overlay 1.1.0 yaml produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay.yaml',
      'yaml',
      0,
      specOverlayYaml,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.1.0 yaml produces no errors', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay11JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
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

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay.yaml',
      'yaml',
      0,
      specOverlayYaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test validation for overlay 1.0.0 yaml produces no errors', async function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(context);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 0, `Expected no errors but got: ${JSON.stringify(errors)}`);

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.0.0 yaml produces no errors', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay10JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
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

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(
      errors.length,
      0,
      `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation for overlay 1.0.0 does not apply 1.1 pattern', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay1JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: false,
        referenceValidation: false,
        semanticLinting: false,
      },
      performanceLogs: logPerformance,
      logLevel,
    };

    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const patternErrors = result.filter(
      (d) => d.source === 'Overlay 1 Schema' && diagnosticText(d.message).includes('pattern'),
    );
    assert.strictEqual(
      patternErrors.length,
      0,
      `Expected no pattern errors for overlay 1.0.0 but got: ${JSON.stringify(patternErrors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test JSON Schema validation catches missing required field (YAML)', async function () {
    const overlayJsonSchemaValidationProvider = new Overlay11JsonSchemaValidationProvider();

    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [overlayJsonSchemaValidationProvider],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: false,
        referenceValidation: false,
        semanticLinting: false,
      },
      performanceLogs: logPerformance,
      logLevel,
    };

    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    // Invalid Overlay document - missing required info.title field
    const invalidOverlayYaml = `overlay: "1.1.0"
info:
  version: "1.0.0"
actions:
  - target: "$.paths"
    update:
      description: test
`;

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/invalid-overlay.yaml',
      'yaml',
      0,
      invalidOverlayYaml,
    );

    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);

    const result = await languageService.doValidation(docOverlayYaml, validationContext);

    const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
    assert.isAtLeast(errors.length, 1, 'Expected at least one error for missing required field');

    const jsonSchemaErrors = errors.filter((d) => d.source === 'Overlay 1.1 Schema');
    assert.isAtLeast(
      jsonSchemaErrors.length,
      1,
      `Expected error from JSON Schema provider but got: ${JSON.stringify(errors, null, 2)}`,
    );

    languageService.terminate();
  });

  it('test hover for overlay 1.0.0 provides documentation on info key', async function () {
    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      specOverlay10Yaml,
    );

    const languageService: LanguageService = getLanguageService(context);

    const hoverResult = await languageService.doHover(docOverlayYaml, Position.create(1, 0));

    assert.isNotNull(hoverResult, 'Expected hover result for info key');
    const contents = hoverResult!.contents;
    const value =
      typeof contents === 'string' ? contents : 'value' in contents ? contents.value : '';
    assert.include(value, 'Info Object', 'Expected hover to contain Info Object documentation');

    languageService.terminate();
  });

  it('test completion for overlay 1.0.0 provides action fields without copy', async function () {
    const overlay10WithCursor = `overlay: "1.0.0"
info:
  title: Overlay for 1.0
  version: "1.0.0"
actions:
  - target: "$.paths['/users'].get"
    `;

    const docOverlayYaml: TextDocument = TextDocument.create(
      'foo://bar/overlay10.yaml',
      'yaml',
      0,
      overlay10WithCursor,
    );

    const languageService: LanguageService = getLanguageService(context);

    const completions = await languageService.doCompletion(docOverlayYaml, Position.create(6, 4));

    const labels = completions?.items?.map((i) => i.label) ?? [];
    assert.include(labels, 'description', 'Expected description completion');
    assert.include(labels, 'update', 'Expected update completion');
    assert.include(labels, 'remove', 'Expected remove completion');
    assert.notInclude(labels, 'copy', 'copy should not be offered in Overlay 1.0');

    languageService.terminate();
  });

  describe('given version specific JSON Schema validation providers', function () {
    const providers = [
      [new Overlay10JsonSchemaValidationProvider(), '1.0.0', 'Overlay 1.0 Schema'],
      [new Overlay11JsonSchemaValidationProvider(), '1.1.0', 'Overlay 1.1 Schema'],
      [new Overlay12JsonSchemaValidationProvider(), '1.2.0', 'Overlay 1.2 Schema'],
    ] as const;

    providers.forEach(([provider, version, name]) => {
      it(`should register ${name} for Overlay ${version} only`, function () {
        assert.deepEqual(provider.namespaces(), [{ namespace: 'overlay', version }]);
        assert.strictEqual(provider.name(), name);
      });
    });
  });

  it('test deprecated Overlay 1 JSON Schema provider uses a custom schema', async function () {
    const customSchema = {
      $id: 'urn:test:overlay-custom-schema',
      type: 'object',
      required: ['x-custom'],
    };
    const contextWithJsonSchema: LanguageServiceContext = {
      metadata: metadata(),
      validatorProviders: [new Overlay1JsonSchemaValidationProvider(customSchema, true)],
      validationContext: {
        jsonSchemaValidation: true,
        semanticValidation: false,
        referenceValidation: false,
        semanticLinting: false,
      },
      performanceLogs: logPerformance,
      logLevel,
    };
    const doc = TextDocument.create('foo://bar/overlay.yaml', 'yaml', 0, specOverlayYaml);
    const languageService: LanguageService = getLanguageService(contextWithJsonSchema);
    try {
      const result = await languageService.doValidation(doc, {
        comments: DiagnosticSeverity.Error,
        maxNumberOfProblems: 100,
        relatedInformation: false,
      });
      const schemaErrors = result.filter(
        (d) => d.source === 'Overlay 1 Schema' && diagnosticText(d.message).includes('x-custom'),
      );
      assert.isAtLeast(
        schemaErrors.length,
        1,
        `Expected the custom schema to be applied but got: ${JSON.stringify(result, null, 2)}`,
      );
    } finally {
      languageService.terminate();
    }
  });

  describe('given Overlay 1.2.0', function () {
    const validationContext: ValidationContext = {
      comments: DiagnosticSeverity.Error,
      maxNumberOfProblems: 100,
      relatedInformation: false,
    };

    const completionLabels = async (text: string, position: Position): Promise<string[]> => {
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, text);
      const languageService: LanguageService = getLanguageService(context);
      try {
        const completions = await languageService.doCompletion(doc, position);
        return completions?.items?.map((i) => i.label) ?? [];
      } finally {
        languageService.terminate();
      }
    };

    const hoverValue = async (text: string, position: Position): Promise<string> => {
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, text);
      const languageService: LanguageService = getLanguageService(context);
      try {
        const hoverResult = await languageService.doHover(doc, position);
        const contents = hoverResult?.contents;
        if (!contents) return '';
        return typeof contents === 'string' ? contents : 'value' in contents ? contents.value : '';
      } finally {
        languageService.terminate();
      }
    };

    it('should detect namespace', async function () {
      const contentLanguage = await findNamespace(specOverlay12Yaml);

      assert.strictEqual(contentLanguage.namespace, 'overlay');
      assert.strictEqual(contentLanguage.version, '1.2.0');
      assert.strictEqual(contentLanguage.format, 'YAML');
      assert.strictEqual(
        contentLanguage.mediaType,
        'application/vnd.oai.overlay+yaml;version=1.2.0',
      );
    });

    it('should produce no errors from semantic validation', async function () {
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, specOverlay12Yaml);
      const languageService: LanguageService = getLanguageService(context);
      try {
        const result = await languageService.doValidation(doc, validationContext);
        assert.deepEqual(result, [], `Expected no diagnostics but got: ${JSON.stringify(result)}`);
      } finally {
        languageService.terminate();
      }
    });

    it('should produce no errors from JSON Schema validation', async function () {
      const contextWithJsonSchema: LanguageServiceContext = {
        ...context,
        validatorProviders: [new Overlay12JsonSchemaValidationProvider()],
      };
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, specOverlay12Yaml);
      const languageService: LanguageService = getLanguageService(contextWithJsonSchema);
      try {
        const result = await languageService.doValidation(doc, validationContext);
        const errors = result.filter((d) => d.severity === DiagnosticSeverity.Error);
        assert.strictEqual(
          errors.length,
          0,
          `Expected no errors but got: ${JSON.stringify(errors, null, 2)}`,
        );
      } finally {
        languageService.terminate();
      }
    });

    it('should report JSON Schema errors for target in Reusable Action fields', async function () {
      const contextWithJsonSchema: LanguageServiceContext = {
        metadata: metadata(),
        validatorProviders: [new Overlay12JsonSchemaValidationProvider()],
        validationContext: {
          jsonSchemaValidation: true,
          semanticValidation: false,
          referenceValidation: false,
          semanticLinting: false,
        },
        performanceLogs: logPerformance,
        logLevel,
      };
      const invalid = specOverlay12Yaml.replace(
        '      fields:\n',
        '      fields:\n        target: $.info\n',
      );
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, invalid);
      const languageService: LanguageService = getLanguageService(contextWithJsonSchema);
      try {
        const result = await languageService.doValidation(doc, validationContext);
        const schemaErrors = result.filter((d) => d.source === 'Overlay 1.2 Schema');
        assert.isAtLeast(
          schemaErrors.length,
          1,
          `Expected error from JSON Schema provider but got: ${JSON.stringify(result, null, 2)}`,
        );
      } finally {
        languageService.terminate();
      }
    });

    it('should complete $self and components on the root object', async function () {
      const labels = await completionLabels(
        'overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - target: $.info\n    remove: true\n',
        Position.create(4, 0),
      );
      assert.include(labels, '$self');
      assert.include(labels, 'components');
    });

    it('should not complete $self and components in Overlay 1.1.0', async function () {
      const labels = await completionLabels(
        'overlay: 1.1.0\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - target: $.info\n    remove: true\n',
        Position.create(4, 0),
      );
      assert.notInclude(labels, '$self');
      assert.notInclude(labels, 'components');
    });

    it('should complete $ref on an Action Object', async function () {
      const labels = await completionLabels(
        'overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - description: d\n    ',
        Position.create(6, 4),
      );
      assert.include(labels, '$ref');
      assert.include(labels, 'target');
    });

    it('should complete Reusable Action fields without target', async function () {
      const labels = await completionLabels(
        "overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - $ref: '#/components/actions/a'\n    target: $.info\ncomponents:\n  actions:\n    a:\n      fields:\n        remove: true\n        ",
        Position.create(12, 8),
      );
      assert.include(labels, 'update');
      assert.include(labels, 'description');
      assert.notInclude(labels, 'target');
      assert.notInclude(labels, '$ref');
    });

    it('should complete Reusable Action Reference fields', async function () {
      const labels = await completionLabels(
        "overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - $ref: '#/components/actions/a'\n    ",
        Position.create(6, 4),
      );
      assert.include(labels, 'target');
      assert.include(labels, 'description');
      assert.notInclude(labels, 'update');
    });

    it('should provide hover documentation for components', async function () {
      const value = await hoverValue(specOverlay12Yaml, Position.create(6, 1));
      assert.include(value, 'Components Object');
    });

    it('should provide hover documentation for Reusable Action Reference $ref', async function () {
      const value = await hoverValue(specOverlay12Yaml, Position.create(15, 5));
      assert.include(value, 'same-document');
    });

    it('should report unresolvable Reusable Action References with quick fixes', async function () {
      const text =
        "overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\ncomponents:\n  actions:\n    errorResponse:\n      fields:\n        remove: true\nactions:\n  - $ref: '#/components/actions/missing'\n    target: $.info\n";
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, text);
      const languageService: LanguageService = getLanguageService(context);
      try {
        const result = await languageService.doValidation(doc, {
          ...validationContext,
          referenceValidation: true,
        });
        assert.deepEqual(
          result.map((d) => [d.message, d.range.start.line]),
          [['local reference not found', 10]],
        );
        assert.deepEqual(
          (result[0].data as { quickFix: { message: string }[] }).quickFix.map((q) => q.message),
          ['update to #/components/actions/errorResponse'],
        );
      } finally {
        languageService.terminate();
      }
    });

    it('should complete Reusable Action Reference $ref values', async function () {
      const labels = await completionLabels(
        "overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\ncomponents:\n  actions:\n    errorResponse:\n      fields:\n        remove: true\n    other:\n      fields:\n        remove: true\nactions:\n  - $ref: ''\n    target: $.info\n",
        Position.create(13, 11),
      );
      assert.sameMembers(labels, [
        '#/components/actions/errorResponse',
        '#/components/actions/other',
      ]);
    });

    it('should dereference Reusable Action References', async function () {
      const doc = TextDocument.create('foo://bar/overlay12.yaml', 'yaml', 0, specOverlay12Yaml);
      const languageService: LanguageService = getLanguageService(context);
      try {
        const result = await languageService.doDeref(doc, {
          format: Format.JSON,
          baseURI: 'https://example.com/overlays/errors.overlay.yaml',
        });
        const { actions } = JSON.parse(result);
        assert.deepEqual(actions[0], {
          target: "$.paths['/items'].get.responses",
          update: { '404': { description: 'Not Found' } },
        });
        assert.deepEqual(actions[1], {
          target: "$.paths['/some-items'].delete.responses",
          update: { '404': { description: 'Not Found' } },
          description: 'Adds a 404 to the delete operation',
        });
      } finally {
        languageService.terminate();
      }
    });
  });
});
