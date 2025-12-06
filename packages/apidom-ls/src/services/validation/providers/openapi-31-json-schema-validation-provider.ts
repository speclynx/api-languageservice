import openapiSchemaJson31Ajv from '../json-schema/open-api-31/spectral/openapi-schema-2021-09-29-spectral.json' with { type: 'json' };
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
export class OpenAPi31JsonSchemaValidationProvider extends JsonSchemaValidationProvider {
  public constructor(jsonSchema?: Record<string, unknown>, ajv2020 = false) {
    // default to OAI provided 3.1 schema
    if (!jsonSchema) {
      super(true, openapiSchemaJson31Ajv);
    } else {
      super(ajv2020, jsonSchema);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  break(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  namespaces(): NamespaceVersion[] {
    return [
      { namespace: 'openapi', version: '3.1.1' },
      { namespace: 'openapi', version: '3.1.0' },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  name(): string {
    return 'OpenAPI 3.1 Schema';
  }
}
