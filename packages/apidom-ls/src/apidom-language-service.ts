import {
  CompletionItem,
  ColorInformation,
  Color,
  ColorPresentation,
  Position,
} from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SemanticTokensLegend } from 'vscode-languageserver-protocol';
import { Element, ParseResultElement } from '@speclynx/apidom-core';
import { evaluate } from '@speclynx/apidom-json-pointer';

import {
  ColorsContext,
  LanguageService,
  LanguageServiceContext,
  LanguageSettings,
} from './apidom-language-types.ts';
import { DefaultValidationService } from './services/validation/validation-service.ts';
import { DefaultCompletionService } from './services/completion/completion-service.ts';
import { DefaultSymbolsService } from './services/symbols/symbols-service.ts';
import { DefaultSemanticTokensService } from './services/semantic-tokens/semantic-tokens-service.ts';
import { DefaultHoverService } from './services/hover/hover-service.ts';
import { DefaultDerefService } from './services/deref/deref-service.ts';
import { DefaultConversionService } from './services/conversion/conversion-service.ts';
import { DefaultDefinitionService } from './services/definition/definition-service.ts';
import { getDocumentCache } from './document-cache.ts';
import { parse } from './parser-factory.ts';
import { config } from './config/config.ts';
import { togglePerformanceLogs, toggleLogs, getSourceMap, debug } from './utils/utils.ts';
import { DefaultLinksService } from './services/links/links-service.ts';
import { DefaultFormattingService } from './services/formatting/formatting-service.ts';

/**
 * @public
 */

export default function getLanguageService(context: LanguageServiceContext): LanguageService {
  togglePerformanceLogs(!!context.performanceLogs);
  if (context.logLevel) toggleLogs(context.logLevel);
  debug('getLanguageService', context);
  const symbolsService = new DefaultSymbolsService();
  const completionService = new DefaultCompletionService();
  const validationService = new DefaultValidationService();
  const semanticTokensService = new DefaultSemanticTokensService();
  const hoverService = new DefaultHoverService();
  const derefService = new DefaultDerefService();
  const formattingService = new DefaultFormattingService();
  const conversionService = new DefaultConversionService(formattingService);
  const definitionService = new DefaultDefinitionService();
  const linksService = new DefaultLinksService();

  function configureServices(languageSettings?: LanguageSettings) {
    symbolsService.configure(languageSettings);
    validationService.configure(languageSettings);
    completionService.configure(languageSettings);
    semanticTokensService.configure(languageSettings);
    hoverService.configure(languageSettings);
    derefService.configure(languageSettings);
    conversionService.configure(languageSettings);
    formattingService.configure(languageSettings);
    definitionService.configure(languageSettings);
    linksService.configure(languageSettings);
  }

  let metadata = config();
  if (context?.metadata) {
    metadata = context.metadata;
  }
  const documentCache = getDocumentCache<ParseResultElement>(10, 60, (document) =>
    parse(document, metadata.metadataMaps, true, true, true, context.defaultContentLanguage),
  );

  const languageSettings: LanguageSettings = {
    metadata,
    validate: true,
    validatorProviders: context?.validatorProviders,
    completionProviders: context?.completionProviders,
    hoverProviders: context?.hoverProviders,
    linksProviders: context?.linksProviders,
    documentCache,
    hoverFollowLinkEntry: context?.hoverFollowLinkEntry,
    performanceLogs: context.performanceLogs,
    logLevel: context.logLevel,
    defaultContentLanguage: context.defaultContentLanguage,
    workspaceFolders: context.workspaceFolders,
    allowComments: context.allowComments,
    validationContext: context.validationContext,
    completionContext: context.completionContext,
    derefContext: context.derefContext,
    symbolsContext: context.symbolsContext,
    colorsContext: context.colorsContext,
    linksContext: context.linksContext,
  };
  configureServices(languageSettings);

  return {
    configure: (settings?: LanguageSettings): void => configureServices(settings),
    doValidation: validationService.doValidation.bind(validationService),
    doCompletion: completionService.doCompletion.bind(completionService),
    doFindDocumentSymbols: symbolsService.doFindDocumentSymbols.bind(symbolsService),
    computeSemanticTokens: semanticTokensService.computeSemanticTokens.bind(semanticTokensService),
    doHover: hoverService.computeHover.bind(hoverService),
    doCodeActions: validationService.doCodeActions.bind(validationService),
    doDeref: derefService.doDeref.bind(derefService),
    doConversion: conversionService.doConversion.bind(conversionService),

    doProvideDefinition: definitionService.doProvideDefinition.bind(definitionService),
    doProvideReferences: definitionService.doProvideReferences.bind(definitionService),
    doFormatting: formattingService.doFormatting.bind(formattingService),

    getSemanticTokensLegend(): SemanticTokensLegend {
      return semanticTokensService.getLegend();
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    doResolveCompletionItem(item: CompletionItem): Promise<CompletionItem> {
      // @ts-ignore
      return Promise.resolve(undefined);
    },
    findDocumentColors(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      document: TextDocument,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      colorsContext?: ColorsContext,
    ): Promise<ColorInformation[]> {
      // @ts-ignore
      return undefined;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getColorPresentations(document: TextDocument, color: Color, range: Range): ColorPresentation[] {
      return [];
    },
    terminate(): void {
      documentCache.dispose();
    },
    registerCompletionProvider: completionService.registerProvider.bind(completionService),
    registerValidationProvider: validationService.registerProvider.bind(validationService),
    doLinks: linksService.doLinks.bind(linksService),
    registerLinksProvider: linksService.registerProvider.bind(linksService),

    async getJsonPointerPosition(document: TextDocument, path: string): Promise<Position | null> {
      const result = await documentCache?.get(
        document,
        undefined,
        'languageService-getJsonPathPosition',
      );
      if (!result) {
        return null;
      }
      const { api } = result;
      // no API document has been parsed
      if (api === undefined) return null;
      try {
        const jsonPointerResult = evaluate<Element>(api, path);
        const sm = getSourceMap(jsonPointerResult);
        return {
          line: sm.line,
          character: sm.column,
        };
      } catch {
        return null;
      }
    },
  };
}
