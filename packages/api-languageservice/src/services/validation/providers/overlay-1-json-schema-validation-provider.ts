import { Diagnostic } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element } from '@speclynx/apidom-datamodel';
import { detectionRegExp } from '@speclynx/apidom-parser-adapter-overlay-yaml-1';

import overlay10Schema from '../json-schema/overlay-1/overlay-1.0-schema.json' with { type: 'json' };
import overlay11Schema from '../json-schema/overlay-1/overlay-1.1-schema.json' with { type: 'json' };
import overlay12Schema from '../json-schema/overlay-1/overlay-1.2-schema.json' with { type: 'json' };
import { JsonSchemaValidationProvider } from './json-schema-validation-provider.ts';
import {
  NamespaceVersion,
  ValidationContext,
  ValidationProviderResult,
} from '../../../apidom-language-types.ts';
import { getSpecVersion } from '../../../utils/utils.ts';

export type { JsonSchemaValidationProvider } from './json-schema-validation-provider.ts';

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
 * Validates Overlay 1.0, 1.1 and 1.2 documents, picking the OAI provided schema matching the
 * document's `overlay` version. A schema passed to the constructor is used for every version.
 *
 * @deprecated Use the version specific `Overlay10JsonSchemaValidationProvider`,
 * `Overlay11JsonSchemaValidationProvider` or `Overlay12JsonSchemaValidationProvider` instead.
 *
 * @public
 */
export class Overlay1JsonSchemaValidationProvider extends JsonSchemaValidationProvider {
  private readonly customSchema: boolean;

  public constructor(jsonSchema?: Record<string, unknown>, ajv2020 = false) {
    if (!jsonSchema) {
      super(true, overlay12Schema);
    } else {
      super(ajv2020, jsonSchema);
    }
    this.customSchema = jsonSchema !== undefined;
  }

  public async doValidation(
    textDocument: TextDocument,
    currentDiagnostics: Diagnostic[],
    validationContext?: ValidationContext,
    api?: Element,
  ): Promise<ValidationProviderResult> {
    if (!this.customSchema) {
      this.jsonSchema = Overlay1JsonSchemaValidationProvider.schemaFor(
        Overlay1JsonSchemaValidationProvider.specVersion(textDocument, api),
      );
    }
    return super.doValidation(textDocument, currentDiagnostics, validationContext, api);
  }

  private static specVersion(textDocument: TextDocument, api?: Element): string | undefined {
    if (api) return getSpecVersion(api);
    const match = textDocument.getText().match(detectionRegExp);
    return match?.groups?.version_json ?? match?.groups?.version_yaml;
  }

  private static schemaFor(specVersion: string | undefined): Record<string, unknown> {
    if (specVersion?.startsWith('1.0')) return overlay10Schema;
    if (specVersion?.startsWith('1.1')) return overlay11Schema;
    return overlay12Schema;
  }

  break(): boolean {
    return false;
  }

  namespaces(): NamespaceVersion[] {
    return [
      { namespace: 'overlay', version: '1.0.0' },
      { namespace: 'overlay', version: '1.1.0' },
      { namespace: 'overlay', version: '1.2.0' },
    ];
  }

  name(): string {
    return 'Overlay 1 Schema';
  }
}
