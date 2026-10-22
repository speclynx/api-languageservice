import YAML from 'yaml';
import { Diagnostic, DiagnosticSeverity, Position, Range } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element } from '@speclynx/apidom-datamodel';
import { toValue } from '@speclynx/apidom-core';

import { createPathPositionResolver, PathPositionResolver } from '../utils/ast.ts';
import {
  LanguageSettings,
  MergeStrategy,
  NamespaceVersion,
  ValidationContext,
  ValidationProvider,
  ValidationProviderResult,
} from '../../../apidom-language-types.ts';
import { AjvErrorObject, betterAjvErrors, BetterError } from './better-errors/index.ts';
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

export type { AjvErrorObject } from './better-errors/index.ts';

/**
 * A function validating data against a JSON Schema, reporting what it finds in `errors` as Ajv
 * does. The providers of this package use functions Ajv generated at build time; a function
 * `Ajv.compile` returns fits as well.
 *
 * @public
 */
export interface JsonSchemaValidateFunction {
  (data: unknown): boolean;
  errors?: AjvErrorObject[] | null;
}

/**
 * Validates documents with a JSON Schema validation function. To validate against a schema of
 * your own, extend it and pass a function compiled with your own Ajv instance.
 *
 * @public
 */
export abstract class JsonSchemaValidationProvider implements ValidationProvider {
  private validationEnabled: boolean | undefined;

  private readonly validateFunction: JsonSchemaValidateFunction;

  protected override = false;

  protected constructor(validateFunction: JsonSchemaValidateFunction) {
    this.validationEnabled = true;
    this.validateFunction = validateFunction;
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

      // get the serialized apidom JSON if doc is yaml; ApiDOM's toValue, like
      // YAML.parse, reads an empty YAML node as null, the value it has in YAML
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
    positionForPath: PathPositionResolver,
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
      const position = positionForPath(
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
      const position = positionForPath(path.split('/').slice(1));
      // an array item has no key of its own, so its value is marked
      if (errorOnValue || !position.object_member) {
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
    const { validateFunction } = this;
    const jsonDoc = JSON.parse(jsonDocument);
    const valid = validateFunction(jsonDoc);
    if (!valid) {
      const positionForPath = createPathPositionResolver(originalDocument, {
        lastDuplicateKey: !isYaml,
      });
      let betterErrors: BetterError[];
      if (validateFunction.errors) {
        const validationErrors = validateFunction.errors.filter(
          JsonSchemaValidationProvider.isRelevantError,
        );
        if (validationContext?.betterAjvErrors) {
          betterErrors = betterAjvErrors(validationErrors, jsonDoc);
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
              positionForPath,
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
              positionForPath,
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
