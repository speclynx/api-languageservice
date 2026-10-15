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
 * Validates with one fixed schema under the deprecated provider's name. Each schema gets its own
 * instance, so concurrent validations never share a mutable schema.
 */
class Overlay1SchemaDelegate extends JsonSchemaValidationProvider {
  public constructor(ajv2020: boolean, jsonSchema: Record<string, unknown>) {
    super(ajv2020, jsonSchema);
  }

  break(): boolean {
    return false;
  }

  namespaces(): NamespaceVersion[] {
    return [];
  }

  name(): string {
    return 'Overlay 1 Schema';
  }
}

/**
 * Validates Overlay 1.0, 1.1 and 1.2 documents, picking the OAI provided schema matching the
 * document's `overlay` version. A schema passed to the constructor is used for every version.
 *
 * @deprecated Use the version specific `Overlay10JsonSchemaValidationProvider`,
 * `Overlay11JsonSchemaValidationProvider` or `Overlay12JsonSchemaValidationProvider` instead.
 * Do not register this provider together with them: both would validate the same document.
 *
 * @public
 */
export class Overlay1JsonSchemaValidationProvider extends JsonSchemaValidationProvider {
  private readonly customSchemaDelegate?: Overlay1SchemaDelegate;

  private readonly versionDelegates: Record<'1.0' | '1.1' | '1.2', Overlay1SchemaDelegate>;

  public constructor(jsonSchema?: Record<string, unknown>, ajv2020 = false) {
    if (!jsonSchema) {
      super(true, overlay12Schema);
    } else {
      super(ajv2020, jsonSchema);
      this.customSchemaDelegate = new Overlay1SchemaDelegate(ajv2020, jsonSchema);
    }
    this.versionDelegates = {
      '1.0': new Overlay1SchemaDelegate(true, overlay10Schema),
      '1.1': new Overlay1SchemaDelegate(true, overlay11Schema),
      '1.2': new Overlay1SchemaDelegate(true, overlay12Schema),
    };
  }

  public async doValidation(
    textDocument: TextDocument,
    currentDiagnostics: Diagnostic[],
    validationContext?: ValidationContext,
    api?: Element,
  ): Promise<ValidationProviderResult> {
    const delegate =
      this.customSchemaDelegate ??
      this.versionDelegate(Overlay1JsonSchemaValidationProvider.specVersion(textDocument, api));
    return delegate.doValidation(textDocument, currentDiagnostics, validationContext, api);
  }

  private static specVersion(textDocument: TextDocument, api?: Element): string | undefined {
    if (api) return getSpecVersion(api);
    const match = textDocument.getText().match(detectionRegExp);
    return match?.groups?.version_json ?? match?.groups?.version_yaml;
  }

  private versionDelegate(specVersion: string | undefined): Overlay1SchemaDelegate {
    if (specVersion?.startsWith('1.0')) return this.versionDelegates['1.0'];
    if (specVersion?.startsWith('1.1')) return this.versionDelegates['1.1'];
    return this.versionDelegates['1.2'];
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
