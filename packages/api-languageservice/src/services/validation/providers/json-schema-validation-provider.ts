import type { Ajv2020 } from 'ajv/dist/2020.d.ts';
import type { Ajv } from 'ajv';
import YAML from 'yaml';
import betterAjvErrors from '@stoplight/better-ajv-errors';
import { Diagnostic, DiagnosticSeverity, Position, Range } from 'vscode-languageserver-types';
import jsonSourceMap from 'json-source-map';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element } from '@speclynx/apidom-datamodel';
import { toValue } from '@speclynx/apidom-core';

import { positionRangeForPath } from '../utils/ast.ts';
import {
  LanguageSettings,
  MergeStrategy,
  NamespaceVersion,
  ValidationContext,
  ValidationProvider,
  ValidationProviderResult,
} from '../../../apidom-language-types.ts';
import * as AjvUtils from './ajv-utils.ts';
import { isJsonDoc } from '../../../utils/utils.ts';

export type {
  LanguageSettings,
  MergeStrategy,
  NamespaceVersion,
  ValidationContext,
  ValidationProvider,
  ValidationProviderResult,
  QuickFixData,
  ProviderMode,
  CompletionProvider,
  HoverProvider,
  LinksProvider,
  Metadata,
  DocumentCache,
  LogLevel,
  ContentLanguage,
  CompletionContext,
  DerefContext,
  SymbolsContext,
  ColorsContext,
  LinksContext,
  ReferenceValidationMode,
  CompletionProviderResult,
  HoverProviderResult,
  LinksProviderResult,
  Format,
  LinksModifierFunction,
  FormatMeta,
  MetadataMaps,
  LinterFunctionsMap,
  DocumentationMeta,
  LinterMeta,
  ApidomCompletionItem,
  MetadataMap,
  LinterFunctions,
  CompletionType,
  CompletionFormat,
  LinterCondition,
  LinterMetaData,
  LinterGivenFormat,
  LinterFunction,
  LinterConditionTarget,
} from '../../../apidom-language-types.ts';

/**
 * @public
 */
export abstract class JsonSchemaValidationProvider implements ValidationProvider {
  private validationEnabled: boolean | undefined;

  protected ajv: Ajv2020 | Ajv;

  protected jsonSchema: Record<string, unknown>;

  protected ajv2020: boolean;

  protected override = false;

  protected constructor(ajv2020: boolean, jsonSchema: Record<string, unknown>) {
    this.validationEnabled = true;
    this.jsonSchema = jsonSchema;
    this.ajv2020 = ajv2020;
    this.ajv = AjvUtils.ajv(ajv2020);
  }

  public setOverrideDefaultValidation(override: boolean): void {
    this.override = override;
  }

  public async doValidation(
    textDocument: TextDocument,
    currentDiagnostics: Diagnostic[],
    validationContext?: ValidationContext,
    api?: Element,
  ): Promise<ValidationProviderResult> {
    const text = textDocument.getText();
    const isYaml = !(await isJsonDoc(text));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise<ValidationProviderResult>((resolve, reject) => {
      const diagnostics: Diagnostic[] = [];

      // get the serialized apidom JSON if doc is yaml
      let jsonText = text;
      if (isYaml) {
        jsonText = JSON.stringify(api ? toValue(api) : YAML.parse(text));
      }
      this.validate(jsonText, text, isYaml, diagnostics, validationContext);
      const result: ValidationProviderResult = {
        diagnostics,
        mergeStrategy: MergeStrategy.PREPEND,
      };

      return resolve(result);
    });
  }

  public configure(settings?: LanguageSettings): void {
    if (settings) {
      this.validationEnabled = settings.validate;
    }
  }

  private buildError(
    originalDocument: string,
    message: string,
    path: string,
    isYaml: boolean,
    diagnostics: Diagnostic[],
    errorPointer: any,
    keyword?: string,
  ): void {
    let range: Range;
    const errorOnValue =
      (keyword && keyword === 'pattern') || keyword === 'format' || keyword === 'errorMessage';
    // if errors are related to root, mark only the first char
    if (!path || path.length === 0) {
      const endChar = !originalDocument || originalDocument.length === 0 ? 0 : 1;
      range = Range.create(Position.create(0, 0), Position.create(0, endChar));
    }
    // TODO fix and solve with consistent YAML / JSON / Adapter
    else if (isYaml) {
      const position = positionRangeForPath(
        originalDocument,
        path.replace(/\/$/, '').replace(/^"/, '').replace(/^\//, '').split('/'),
      );
      if (errorOnValue || !position.key_start) {
        range = Range.create(
          Position.create(position.start.line, position.start.column),
          Position.create(position.end.line, position.end.column),
        );
      } else {
        range = Range.create(
          Position.create(position.key_start.line, position.key_start.column),
          Position.create(position.key_end.line, position.key_end.column),
        );
      }
    } else {
      if (errorOnValue || !errorPointer.key) {
        range = Range.create(
          Position.create(errorPointer.value.line, errorPointer.value.column),
          Position.create(errorPointer.valueEnd.line, errorPointer.valueEnd.column),
        );
      } else {
        range = Range.create(
          Position.create(errorPointer.key.line, errorPointer.key.column),
          Position.create(errorPointer.keyEnd.line, errorPointer.keyEnd.column),
        );
      }
    }

    const diagnostic = Diagnostic.create(
      range,
      message || '',
      DiagnosticSeverity.Error,
      0,
      this.name(),
    );
    diagnostics.push(diagnostic);
  }

  protected static isRelevantError(error: { keyword?: string }): boolean {
    return error.keyword !== 'if';
  }

  public validate(
    jsonDocument: string,
    originalDocument: string,
    isYaml: boolean,
    diagnostics: Diagnostic[],

    validationContext?: ValidationContext,
  ): void {
    if (!this.validationEnabled) {
      return;
    }
    const validateFunction = AjvUtils.compileAjv(this.jsonSchema, this.ajv2020);
    const jsonDoc = JSON.parse(jsonDocument);
    const valid = validateFunction(jsonDoc);
    if (!valid) {
      const sourceMap = jsonSourceMap.parse(jsonDocument, null, 2);
      let betterErrors: betterAjvErrors.IOutputError[];
      if (validateFunction.errors) {
        const validationErrors = validateFunction.errors.filter(
          JsonSchemaValidationProvider.isRelevantError,
        );
        if (validationContext?.betterAjvErrors) {
          betterErrors = betterAjvErrors(this.jsonSchema, validationErrors, {
            propertyPath: [],
            targetValue: jsonDoc,
          });
          betterErrors.forEach((error) => {
            if (
              validationContext &&
              validationContext.maxNumberOfProblems &&
              diagnostics.length > validationContext.maxNumberOfProblems
            ) {
              return;
            }
            this.buildError(
              originalDocument,
              error.error,
              error.path,
              isYaml,
              diagnostics,
              sourceMap.pointers[error.path],
            );
          });
        } else {
          validationErrors.forEach((error) => {
            if (
              validationContext &&
              validationContext.maxNumberOfProblems &&
              diagnostics.length > validationContext.maxNumberOfProblems
            ) {
              return;
            }
            this.buildError(
              originalDocument,
              error.message || '',
              error.instancePath,
              isYaml,
              diagnostics,
              sourceMap.pointers[error.instancePath],
              error.keyword,
            );
          });
        }
      }
    }
  }

  public abstract break(): boolean;

  public overrideDefaultValidation(): boolean {
    return this.override;
  }

  jsonSchemaValidation(): boolean {
    return true;
  }

  public abstract namespaces(): NamespaceVersion[];

  public abstract name(): string;
}
