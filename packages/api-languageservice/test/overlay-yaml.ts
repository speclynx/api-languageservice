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
  ReferenceValidationMode,
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

  it('test deprecated Overlay 1 JSON Schema provider validates versions concurrently', async function () {
    const provider = new Overlay1JsonSchemaValidationProvider();
    const versions = ['1.0.0', '1.1.0', '1.2.0'];
    const results = await Promise.all(
      versions.map((version) =>
        provider.doValidation(
          TextDocument.create(
            `foo://bar/overlay-${version}.yaml`,
            'yaml',
            0,
            `overlay: ${version}\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - target: $.info\n    remove: true\n`,
          ),
          [],
        ),
      ),
    );
    results.forEach((result, i) => {
      assert.deepEqual(
        result.diagnostics.map((d) => d.message),
        [],
        `Expected no schema errors for overlay ${versions[i]}`,
      );
    });
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
        const fieldsLine = invalid.split('\n').indexOf('      fields:');
        // `target` is not an evaluated property of the Reusable Action `fields` object
        assert.deepEqual(
          result.map((d) => [d.source, diagnosticText(d.message), d.range.start.line]),
          [['Overlay 1.2 Schema', 'must NOT have unevaluated properties', fieldsLine]],
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

    [
      ReferenceValidationMode.LEGACY,
      ReferenceValidationMode.APIDOM_INDIRECT,
      ReferenceValidationMode.APIDOM_INDIRECT_EXTERNAL,
    ].forEach((referenceValidationMode) => {
      [false, true].forEach((referenceValidationSequentialProcessing) => {
        it(`should validate Reusable Action References by pointer lookup (mode ${referenceValidationMode}, sequential ${referenceValidationSequentialProcessing})`, async function () {
          const text = (ref: string) =>
            `overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\ncomponents:\n  actions:\n    errorResponse:\n      fields:\n        remove: true\nactions:\n  - $ref: '${ref}'\n    target: $.info\n`;
          const languageService: LanguageService = getLanguageService(context);
          try {
            const refContext = {
              ...validationContext,
              referenceValidation: true,
              referenceValidationMode,
              referenceValidationSequentialProcessing,
            };
            const valid = await languageService.doValidation(
              TextDocument.create(
                'foo://bar/valid.yaml',
                'yaml',
                0,
                text('#/components/actions/errorResponse'),
              ),
              refContext,
            );
            assert.deepEqual(
              valid,
              [],
              `Expected no diagnostics but got: ${JSON.stringify(valid)}`,
            );

            const missing = await languageService.doValidation(
              TextDocument.create(
                'foo://bar/missing.yaml',
                'yaml',
                0,
                text('#/components/actions/missing'),
              ),
              refContext,
            );
            assert.deepEqual(
              missing.map((d) => d.message),
              ['local reference not found'],
            );
          } finally {
            languageService.terminate();
          }
        });
      });
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

    it('should document description of a Reusable Action Reference with its own docs', async function () {
      const referenceDescription = await hoverValue(specOverlay12Yaml, Position.create(19, 6));
      assert.include(referenceDescription, 'A description of the action.');
      assert.include(
        referenceDescription,
        'the description from the Reusable Action Reference Object MUST be used',
      );
      assert.notInclude(referenceDescription, 'A description of the reusable action.');

      const reusableActionDescription = await hoverValue(specOverlay12Yaml, Position.create(9, 8));
      assert.include(reusableActionDescription, 'A description of the reusable action.');
    });

    const nonStringCases: [string, RegExp, string, number[]][] = [
      ['$self', /^\$self: .*$/m, '$self:\n  uri: https://example.com/o.yaml', [10010600]],
      ['extends', /^extends: .*$/m, 'extends: 5', [10010300]],
      [
        '$ref',
        /^ {2}- \$ref: '#\/components\/actions\/errorResponse'\n(?= {4}target: "\$\.paths\['\/items'\])/m,
        '  - $ref: 5\n',
        [10060101],
      ],
    ];
    nonStringCases.forEach(([field, pattern, replacement, expectedCodes]) => {
      it(`should report only the type of a non-string ${field}`, async function () {
        const text = specOverlay12Yaml.replace(pattern, replacement);
        assert.notStrictEqual(text, specOverlay12Yaml);
        const doc = TextDocument.create(`foo://bar/non-string-${field}.yaml`, 'yaml', 0, text);
        const languageService: LanguageService = getLanguageService(context);
        try {
          const result = await languageService.doValidation(doc, validationContext);
          assert.deepEqual(
            result.map((d) => d.code),
            expectedCodes,
          );
        } finally {
          languageService.terminate();
        }
      });
    });

    it('should not complete $ref on an Action Object with a modifier', async function () {
      const labels = await completionLabels(
        'overlay: 1.2.0\ninfo:\n  title: t\n  version: 1.0.0\nactions:\n  - target: $.info\n    update: {}\n    ',
        Position.create(7, 4),
      );
      assert.notInclude(labels, '$ref');
      assert.include(labels, 'description');
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
