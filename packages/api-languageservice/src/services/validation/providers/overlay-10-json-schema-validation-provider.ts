import validateOverlay10 from '../json-schema/validators/overlay-1-0.ts';
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
export class Overlay10JsonSchemaValidationProvider extends JsonSchemaValidationProvider {
  public constructor() {
    super(validateOverlay10);
  }

  break(): boolean {
    return false;
  }

  namespaces(): NamespaceVersion[] {
    return [{ namespace: 'overlay', version: '1.0.0' }];
  }

  name(): string {
    return 'Overlay 1.0 Schema';
  }
}
