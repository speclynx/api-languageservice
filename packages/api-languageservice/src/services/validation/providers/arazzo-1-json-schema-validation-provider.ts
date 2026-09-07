import arazzoSchema from '../json-schema/arazzo-1/arazzo-schema-2025-10-15.json' with { type: 'json' };
import { JsonSchemaValidationProvider } from './json-schema-validation-provider.ts';
import { NamespaceVersion } from '../../../apidom-language-types.ts';

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
export class Arazzo1JsonSchemaValidationProvider extends JsonSchemaValidationProvider {
  public constructor(jsonSchema?: Record<string, unknown>, ajv2020 = false) {
    // default to OAI provided Arazzo 1.0 schema
    if (!jsonSchema) {
      super(true, arazzoSchema);
    } else {
      super(ajv2020, jsonSchema);
    }
  }

  break(): boolean {
    return false;
  }

  namespaces(): NamespaceVersion[] {
    return [
      { namespace: 'arazzo', version: '1.0.0' },
      { namespace: 'arazzo', version: '1.0.1' },
    ];
  }

  name(): string {
    return 'Arazzo 1.0 Schema';
  }
}
