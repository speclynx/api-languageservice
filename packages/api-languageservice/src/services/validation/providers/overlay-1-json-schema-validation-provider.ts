import { Diagnostic } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element } from '@speclynx/apidom-datamodel';
import { detectionRegExp } from '@speclynx/apidom-parser-adapter-overlay-yaml-1';

import overlay10Schema from '../json-schema/overlay-1/overlay-1.0-schema.json' with { type: 'json' };
import overlay11Schema from '../json-schema/overlay-1/overlay-1.1-schema.json' with { type: 'json' };
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
 * @public
 */
export class Overlay1JsonSchemaValidationProvider extends JsonSchemaValidationProvider {
  private overlay10Schema: Record<string, unknown>;

  private overlay11Schema: Record<string, unknown>;

  public constructor(jsonSchema?: Record<string, unknown>, ajv2020 = false) {
    if (!jsonSchema) {
      super(true, overlay11Schema);
    } else {
      super(ajv2020, jsonSchema);
    }
    this.overlay10Schema = overlay10Schema;
    this.overlay11Schema = overlay11Schema;
  }

  public async doValidation(
    textDocument: TextDocument,
    currentDiagnostics: Diagnostic[],
    validationContext?: ValidationContext,
    api?: Element,
  ): Promise<ValidationProviderResult> {
    let specVersion: string | undefined;
    if (api) {
      specVersion = getSpecVersion(api);
    } else {
      const text = textDocument.getText();
      const match = text.match(detectionRegExp);
      if (match?.groups) {
        specVersion = match.groups.version_json ?? match.groups.version_yaml;
      }
    }
    if (specVersion?.startsWith('1.0')) {
      this.jsonSchema = this.overlay10Schema;
    } else {
      this.jsonSchema = this.overlay11Schema;
    }
    return super.doValidation(textDocument, currentDiagnostics, validationContext, api);
  }

  break(): boolean {
    return false;
  }

  namespaces(): NamespaceVersion[] {
    return [
      { namespace: 'overlay', version: '1.0.0' },
      { namespace: 'overlay', version: '1.1.0' },
    ];
  }

  name(): string {
    return 'Overlay 1 Schema';
  }
}
