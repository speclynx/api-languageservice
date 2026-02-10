export {
  isRefElement,
  isLinkElement,
  isMemberElement,
  isObjectElement,
  isArrayElement,
  isBooleanElement,
  isNullElement,
  isElement,
  isNumberElement,
  isStringElement,
} from '@speclynx/apidom-datamodel';

export type { JsonSchemaValidationProvider } from './services/validation/providers/json-schema-validation-provider.ts';
export { OpenAPi20JsonSchemaValidationProvider } from './services/validation/providers/openapi-20-json-schema-validation-provider.ts';
export { OpenAPi30JsonSchemaValidationProvider } from './services/validation/providers/openapi-30-json-schema-validation-provider.ts';
export { OpenAPi31JsonSchemaValidationProvider } from './services/validation/providers/openapi-31-json-schema-validation-provider.ts';
export { Arazzo1JsonSchemaValidationProvider } from './services/validation/providers/arazzo-1-json-schema-validation-provider.ts';

export { default as ApilintCodes } from './config/codes.ts';

export {
  perfStart,
  perfEnd,
  isJsonDoc,
  isJsonDocSync,
  isYamlDoc,
  getText,
  findNamespace,
} from './utils/utils.ts';

export { default as getLanguageService } from './apidom-language-service.ts';

export type {
  LanguageService,
  LanguageSettings,
  SymbolsContext,
  ValidationContext,
  CompletionContext,
  LinksContext,
  DerefContext,
  ValidationProvider,
  CompletionProvider,
  LinksProvider,
  WorkspaceContextService,
  ColorsContext,
  LanguageServiceContext,
  MetadataMap,
  Metadata,
  LinterMeta,
  LinterFunctionsMap,
  LinterFunctions,
  MetadataMaps,
  ApidomCompletionItem,
  CompletionProviderResult,
  ValidationProviderResult,
  HoverProviderResult,
  LinksProviderResult,
  ContentLanguage,
  HoverProvider,
  QuickFixData,
  DocumentCache,
  LinksModifierFunction,
  NamespaceVersion,
  LinterCondition,
  LinterMetaData,
  LinterGivenFormat,
  FormatMeta,
  LinterFunction,
  LinterConditionTarget,
  DocumentationMeta,
  ConversionResult,
  ConversionOptions,
  ParseContext,
  ArazzoParseContext,
} from './apidom-language-types.ts';

export {
  Format,
  CompletionType,
  ReferenceValidationMode,
  CompletionFormat,
  LogLevel,
  MergeStrategy,
  ProviderMode,
  DiagnosticCategory,
} from './apidom-language-types.ts';

export { config } from './config/config.ts';
export {
  AsyncAPI as AsyncAPITargetSpecs,
  OpenAPI as OpenAPITargetSpecs,
  JSONSchema202012 as JSONSchema202012TargetSpecs,
} from './config/target-specs.ts';
export { default as isValidLinterMeta } from './utils/guards.ts';
