import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { fileURLToPath } from 'node:url';

import getLanguageService from '../../../../src/apidom-language-service.ts';
import {
  LanguageService,
  LanguageServiceContext,
  ValidationContext,
} from '../../../../src/apidom-language-types.ts';
import { metadata } from './../../../metadata.ts';
import { logPerformance, logLevel } from './../../../test-utils.ts';
import codes from '../../../../src/config/codes.ts';

const fixturesDir = fileURLToPath(new URL('../../../fixtures', import.meta.url));

describe('test-arazzo-linting-JSONSchema', function () {
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

  function testSchemaRule(ruleCode: number, fixtureDir: string, codeName: string): void {
    it(`test ${codeName}`, async function () {
      const validationContext: ValidationContext = {
        comments: DiagnosticSeverity.Error,
        maxNumberOfProblems: 100,
        relatedInformation: false,
      };

      const specInvalid = fs
        .readFileSync(
          path.join(fixturesDir, 'arazzo', 'JSONSchema', fixtureDir, 'arazzo-invalid.yaml'),
        )
        .toString();

      const docInvalid: TextDocument = TextDocument.create(
        'foo://bar/arazzo-invalid.yaml',
        'yaml',
        0,
        specInvalid,
      );

      const specValid = fs
        .readFileSync(
          path.join(fixturesDir, 'arazzo', 'JSONSchema', fixtureDir, 'arazzo-valid.yaml'),
        )
        .toString();

      const docValid: TextDocument = TextDocument.create(
        'foo://bar/arazzo-valid.yaml',
        'yaml',
        0,
        specValid,
      );

      const languageService: LanguageService = getLanguageService(context);

      const resultInvalid = await languageService.doValidation(docInvalid, validationContext);
      const matchingErrors = resultInvalid.filter((d) => d.code === ruleCode);
      assert(
        matchingErrors.length > 0,
        `Expected at least one ${codeName} error (code ${ruleCode}), got ${resultInvalid.length} total diagnostics: ${JSON.stringify(resultInvalid.map((d) => ({ code: d.code, message: d.message })))}`,
      );

      const resultValid = await languageService.doValidation(docValid, validationContext);
      const matchingErrorsValid = resultValid.filter((d) => d.code === ruleCode);
      assert(
        matchingErrorsValid.length === 0,
        `Expected no ${codeName} errors, got ${matchingErrorsValid.length}: ${JSON.stringify(matchingErrorsValid.map((d) => ({ code: d.code, message: d.message })))}`,
      );

      languageService.terminate();
    });
  }

  // ---- Simple type validation rules ----

  testSchemaRule(codes.SCHEMA_TYPE, 'SCHEMA_TYPE', 'SCHEMA_TYPE');
  testSchemaRule(codes.SCHEMA_DEPRECATED, 'SCHEMA_DEPRECATED', 'SCHEMA_DEPRECATED');
  testSchemaRule(codes.SCHEMA_DESCRIPTION, 'SCHEMA_DESCRIPTION', 'SCHEMA_DESCRIPTION');
  testSchemaRule(codes.SCHEMA_TITLE, 'SCHEMA_TITLE', 'SCHEMA_TITLE');
  testSchemaRule(codes.SCHEMA_FORMAT, 'SCHEMA_FORMAT', 'SCHEMA_FORMAT');
  testSchemaRule(codes.SCHEMA_PATTERN, 'SCHEMA_PATTERN', 'SCHEMA_PATTERN');
  testSchemaRule(codes.SCHEMA_READONLY, 'SCHEMA_READONLY', 'SCHEMA_READONLY');
  testSchemaRule(codes.SCHEMA_WRITEONLY, 'SCHEMA_WRITEONLY', 'SCHEMA_WRITEONLY');
  testSchemaRule(codes.SCHEMA_UNIQUEITEMS, 'SCHEMA_UNIQUEITEMS', 'SCHEMA_UNIQUEITEMS');

  // ---- Numeric type checks ----

  testSchemaRule(codes.SCHEMA_MAXIMUM, 'SCHEMA_MAXIMUM', 'SCHEMA_MAXIMUM');
  testSchemaRule(codes.SCHEMA_MINUMUM, 'SCHEMA_MINUMUM', 'SCHEMA_MINUMUM');
  testSchemaRule(
    codes.SCHEMA_EXCLUSIVEMAXIMUM,
    'SCHEMA_EXCLUSIVEMAXIMUM',
    'SCHEMA_EXCLUSIVEMAXIMUM',
  );
  testSchemaRule(
    codes.SCHEMA_EXCLUSIVEMINUMUM,
    'SCHEMA_EXCLUSIVEMINUMUM',
    'SCHEMA_EXCLUSIVEMINUMUM',
  );
  testSchemaRule(codes.SCHEMA_MAXLENGTH, 'SCHEMA_MAXLENGTH', 'SCHEMA_MAXLENGTH');
  testSchemaRule(codes.SCHEMA_MINLENGTH, 'SCHEMA_MINLENGTH', 'SCHEMA_MINLENGTH');
  testSchemaRule(codes.SCHEMA_MAXITEMS, 'SCHEMA_MAXITEMS', 'SCHEMA_MAXITEMS');
  testSchemaRule(codes.SCHEMA_MINITEMS, 'SCHEMA_MINITEMS', 'SCHEMA_MINITEMS');
  testSchemaRule(codes.SCHEMA_MINPROPERTIES, 'SCHEMA_MINPROPERTIES', 'SCHEMA_MINPROPERTIES');
  testSchemaRule(codes.SCHEMA_MAXPROPERTIES, 'SCHEMA_MAXPROPERTIES', 'SCHEMA_MAXPROPERTIES');
  testSchemaRule(codes.SCHEMA_MULTIPLEOF, 'SCHEMA_MULTIPLEOF', 'SCHEMA_MULTIPLEOF');

  // ---- Object type checks (properties, patternProperties) ----

  testSchemaRule(
    codes.SCHEMA_PROPERTIES_OBJECT,
    'SCHEMA_PROPERTIES_OBJECT',
    'SCHEMA_PROPERTIES_OBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_PATTERNPROPERTIES_OBJECT,
    'SCHEMA_PATTERNPROPERTIES_OBJECT',
    'SCHEMA_PATTERNPROPERTIES_OBJECT',
  );

  // ---- Element/class type checks (must be schema or boolean schema) ----

  testSchemaRule(codes.SCHEMA_ADDITIONALITEMS, 'SCHEMA_ADDITIONALITEMS', 'SCHEMA_ADDITIONALITEMS');
  testSchemaRule(
    codes.SCHEMA_ADDITIONALPROPERTIES,
    'SCHEMA_ADDITIONALPROPERTIES',
    'SCHEMA_ADDITIONALPROPERTIES',
  );
  testSchemaRule(codes.SCHEMA_CONTAINS, 'SCHEMA_CONTAINS', 'SCHEMA_CONTAINS');
  testSchemaRule(codes.SCHEMA_IF, 'SCHEMA_IF', 'SCHEMA_IF');
  testSchemaRule(codes.SCHEMA_ELSE, 'SCHEMA_ELSE', 'SCHEMA_ELSE');
  testSchemaRule(codes.SCHEMA_THEN, 'SCHEMA_THEN', 'SCHEMA_THEN');
  testSchemaRule(codes.SCHEMA_NOT, 'SCHEMA_NOT', 'SCHEMA_NOT');
  testSchemaRule(codes.SCHEMA_PROPERTYNAMES, 'SCHEMA_PROPERTYNAMES', 'SCHEMA_PROPERTYNAMES');
  testSchemaRule(codes.SCHEMA_ITEMS, 'SCHEMA_ITEMS', 'SCHEMA_ITEMS');

  // ---- Array of schemas checks ----

  testSchemaRule(codes.SCHEMA_ALLOF, 'SCHEMA_ALLOF', 'SCHEMA_ALLOF');
  testSchemaRule(codes.SCHEMA_ANYOF, 'SCHEMA_ANYOF', 'SCHEMA_ANYOF');
  testSchemaRule(codes.SCHEMA_ONEOF, 'SCHEMA_ONEOF', 'SCHEMA_ONEOF');

  // ---- Enum and array checks ----

  testSchemaRule(codes.SCHEMA_ENUM, 'SCHEMA_ENUM', 'SCHEMA_ENUM');
  testSchemaRule(codes.SCHEMA_EXAMPLES, 'SCHEMA_EXAMPLES', 'SCHEMA_EXAMPLES');
  testSchemaRule(codes.SCHEMA_REQUIRED, 'SCHEMA_REQUIRED', 'SCHEMA_REQUIRED');

  // ---- Properties / patternProperties values type checks ----

  testSchemaRule(codes.SCHEMA_PROPERTIES, 'SCHEMA_PROPERTIES', 'SCHEMA_PROPERTIES');
  testSchemaRule(
    codes.SCHEMA_PATTERNPROPERTIES,
    'SCHEMA_PATTERNPROPERTIES',
    'SCHEMA_PATTERNPROPERTIES',
  );
  testSchemaRule(
    codes.SCHEMA_PATTERNPROPERTIES_KEY,
    'SCHEMA_PATTERNPROPERTIES_KEY',
    'SCHEMA_PATTERNPROPERTIES_KEY',
  );

  // ---- "non-X" condition-based warnings (field on wrong type) ----

  testSchemaRule(codes.SCHEMA_ITEMS_NONARRAY, 'SCHEMA_ITEMS_NONARRAY', 'SCHEMA_ITEMS_NONARRAY');
  testSchemaRule(
    codes.SCHEMA_ADDITIONALITEMS_NONARRAY,
    'SCHEMA_ADDITIONALITEMS_NONARRAY',
    'SCHEMA_ADDITIONALITEMS_NONARRAY',
  );
  testSchemaRule(
    codes.SCHEMA_MAXITEMS_NONARRAY,
    'SCHEMA_MAXITEMS_NONARRAY',
    'SCHEMA_MAXITEMS_NONARRAY',
  );
  testSchemaRule(
    codes.SCHEMA_MINITEMS_NONARRAY,
    'SCHEMA_MINITEMS_NONARRAY',
    'SCHEMA_MINITEMS_NONARRAY',
  );
  testSchemaRule(
    codes.SCHEMA_UNIQUEITEMS_NONARRAY,
    'SCHEMA_UNIQUEITEMS_NONARRAY',
    'SCHEMA_UNIQUEITEMS_NONARRAY',
  );
  testSchemaRule(
    codes.SCHEMA_CONTAINS_NONARRAY,
    'SCHEMA_CONTAINS_NONARRAY',
    'SCHEMA_CONTAINS_NONARRAY',
  );
  testSchemaRule(
    codes.SCHEMA_MAXLENGTH_NONSTRING,
    'SCHEMA_MAXLENGTH_NONSTRING',
    'SCHEMA_MAXLENGTH_NONSTRING',
  );
  testSchemaRule(
    codes.SCHEMA_MINLENGTH_NONSTRING,
    'SCHEMA_MINLENGTH_NONSTRING',
    'SCHEMA_MINLENGTH_NONSTRING',
  );
  testSchemaRule(
    codes.SCHEMA_ADDITIONALPROPERTIES_NONOBJECT,
    'SCHEMA_ADDITIONALPROPERTIES_NONOBJECT',
    'SCHEMA_ADDITIONALPROPERTIES_NONOBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_MINPROPERTIES_NONOBJECT,
    'SCHEMA_MINPROPERTIES_NONOBJECT',
    'SCHEMA_MINPROPERTIES_NONOBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_MAXPROPERTIES_NONOBJECT,
    'SCHEMA_MAXPROPERTIES_NONOBJECT',
    'SCHEMA_MAXPROPERTIES_NONOBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_PROPERTIES_NONOBJECT,
    'SCHEMA_PROPERTIES_NONOBJECT',
    'SCHEMA_PROPERTIES_NONOBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_REQUIRED_NONOBJECT,
    'SCHEMA_REQUIRED_NONOBJECT',
    'SCHEMA_REQUIRED_NONOBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_PATTERNPROPERTIES_NONOBJECT,
    'SCHEMA_PATTERNPROPERTIES_NONOBJECT',
    'SCHEMA_PATTERNPROPERTIES_NONOBJECT',
  );
  testSchemaRule(
    codes.SCHEMA_PROPERTYNAMES_NONOBJECT,
    'SCHEMA_PROPERTYNAMES_NONOBJECT',
    'SCHEMA_PROPERTYNAMES_NONOBJECT',
  );

  // ---- if/then/else condition-based warnings ----

  testSchemaRule(codes.SCHEMA_IF_NONTHEN, 'SCHEMA_IF_NONTHEN', 'SCHEMA_IF_NONTHEN');
  testSchemaRule(codes.SCHEMA_THEN_NONIF, 'SCHEMA_THEN_NONIF', 'SCHEMA_THEN_NONIF');
  testSchemaRule(codes.SCHEMA_ELSE_NONIF, 'SCHEMA_ELSE_NONIF', 'SCHEMA_ELSE_NONIF');

  // ---- Special condition rules ----

  testSchemaRule(
    codes.SCHEMA_REQUIRED_WITHOUT_PROPERTIES,
    'SCHEMA_REQUIRED_WITHOUT_PROPERTIES',
    'SCHEMA_REQUIRED_WITHOUT_PROPERTIES',
  );
  testSchemaRule(
    codes.SCHEMA_TYPE_ARRAY_NON_ITEMS,
    'SCHEMA_TYPE_ARRAY_NON_ITEMS',
    'SCHEMA_TYPE_ARRAY_NON_ITEMS',
  );
  testSchemaRule(
    codes.SCHEMA_MISSING_CORE_FIELDS,
    'SCHEMA_MISSING_CORE_FIELDS',
    'SCHEMA_MISSING_CORE_FIELDS',
  );

  // ---- JSON Schema 2020-12 composed rules ----

  testSchemaRule(
    codes['JSON_SCHEMA_2020_12_KEYWORD_$COMMENT_TYPE'],
    'JSON_SCHEMA_2020_12_KEYWORD_COMMENT_TYPE',
    'JSON_SCHEMA_2020_12_KEYWORD_$COMMENT_TYPE',
  );
  testSchemaRule(
    codes['JSON_SCHEMA_2020_12_KEYWORD_$ID_FORMAT_URI'],
    'JSON_SCHEMA_2020_12_KEYWORD_ID_FORMAT_URI',
    'JSON_SCHEMA_2020_12_KEYWORD_$ID_FORMAT_URI',
  );
  testSchemaRule(
    codes['JSON_SCHEMA_2020_12_KEYWORD_$SCHEMA_FORMAT_URI'],
    'JSON_SCHEMA_2020_12_KEYWORD_SCHEMA_FORMAT_URI',
    'JSON_SCHEMA_2020_12_KEYWORD_$SCHEMA_FORMAT_URI',
  );
  testSchemaRule(
    codes['JSON_SCHEMA_2020_12_KEYWORD_$REF_FORMAT_URI'],
    'JSON_SCHEMA_2020_12_KEYWORD_REF_FORMAT_URI',
    'JSON_SCHEMA_2020_12_KEYWORD_$REF_FORMAT_URI',
  );
});
