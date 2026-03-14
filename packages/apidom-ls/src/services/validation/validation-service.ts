import { CodeAction, Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element, ObjectElement, ParseResultElement, cloneDeep } from '@speclynx/apidom-datamodel';
import { type Path, findAtOffset, forEach } from '@speclynx/apidom-traverse';
import { toValue } from '@speclynx/apidom-core';
import { CodeActionKind, CodeActionParams } from 'vscode-languageserver-protocol';
import { evaluate } from '@speclynx/apidom-json-path';
import { dereferenceApiDOM, Reference, ReferenceSet, options } from '@speclynx/apidom-reference';

import {
  APIDOM_LINTER,
  LanguageSettings,
  LinterGivenFormat,
  LinterMeta,
  LinterMetaData,
  MergeStrategy,
  MetadataMap,
  Pointer,
  ProviderMode,
  QuickFixData,
  ValidationContext,
  ValidationProvider,
  ContentLanguage,
  ReferenceValidationMode,
  DiagnosticCategory,
} from '../../apidom-language-types.ts';
import {
  checkConditions,
  correctPartialKeys,
  findNamespace,
  getSourceMap,
  getSpecVersion,
  isJsonDoc,
  isMember,
  isObject,
  localReferencePointers,
  perfEnd,
  perfStart,
  processPath,
  error,
  info,
  getReferencedElementValue,
} from '../../utils/utils.ts';
import { standardLinterfunctionsMap } from './linter-functions.ts';

enum PerfLabels {
  START = 'doValidation',
}

export interface ValidationService {
  doValidation(
    textDocument: TextDocument,
    validationContext?: ValidationContext,
  ): Promise<Diagnostic[]>;

  doCodeActions(textDocument: TextDocument, parms: CodeActionParams): Promise<CodeAction[]>;

  configure(settings: LanguageSettings): void;

  registerProvider(provider: ValidationProvider): void;
}

export class DefaultValidationService implements ValidationService {
  private validationEnabled: boolean | undefined;

  private commentSeverity: DiagnosticSeverity | undefined;

  private settings: LanguageSettings | undefined;

  private validationProviders: ValidationProvider[] = [];

  private quickFixesMap: Record<string, QuickFixData[]> = {};

  public constructor() {
    this.validationEnabled = true;
    this.commentSeverity = undefined;
  }

  private static matchesCategory(validation: boolean, linting: boolean, r: LinterMeta): boolean {
    let matchesCategory = false;
    if (validation && !linting) {
      matchesCategory = !r.category || r.category === DiagnosticCategory.VALIDATION;
    } else if (linting && !validation) {
      matchesCategory = r.category === DiagnosticCategory.LINT;
    } else if (validation && linting) {
      matchesCategory = true;
    }
    return matchesCategory;
  }

  private static createCachedParser(parser: any) {
    const cachedParser = Object.create(parser);

    cachedParser.cache = new Map();
    cachedParser.parse = async function parse(
      file: {
        uri: string;
        mediaType: string;
      },
      ...rest: unknown[]
    ): Promise<ParseResultElement> {
      const cacheKey = `${file.uri}-${file.mediaType}`;

      // cache hit
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // preparing deferred and setting to cache
      let resolve: (value: ParseResultElement | PromiseLike<ParseResultElement>) => void;
      let reject: (reason?: any) => void;
      const deferred = new Promise<ParseResultElement>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      this.cache.set(cacheKey, deferred);

      // parsing and settling deferred
      parser
        .parse(file, ...rest)
        .then(resolve!)
        .catch(reject!);

      return deferred;
    };

    return cachedParser;
  }

  public registerProvider(provider: ValidationProvider): void {
    this.validationProviders.push(provider);
    if (this.settings && provider.configure) {
      provider.configure(this.settings);
    }
  }

  public configure(settings?: LanguageSettings): void {
    this.settings = settings;
    if (settings) {
      if (settings.validatorProviders) {
        this.validationProviders = settings.validatorProviders;
      }
      for (const provider of this.validationProviders) {
        if (provider.configure) {
          provider.configure(settings);
        }
      }
      this.validationEnabled = settings.validate;
      this.commentSeverity = settings.allowComments ? undefined : DiagnosticSeverity.Error;
      this.quickFixesMap = {};
    }
  }

  private static matchesTargetSpecs(rule: LinterMeta, docNs: string, specVersion: string): boolean {
    if (!rule.targetSpecs) return true;
    return rule.targetSpecs.some((nsv) => {
      if (!nsv.version || nsv.version === '') {
        return nsv.namespace === docNs;
      } else if (nsv.version.includes('x')) {
        const prefix = nsv.version.split('x', 1)[0].trim();
        return nsv.namespace === docNs && specVersion.startsWith(prefix);
      } else {
        return nsv.namespace === docNs && nsv.version === specVersion;
      }
    });
  }

  private getLintingRulesSemantic(
    doc: Element,
    symbol: string,
    docNs: string,
    specVersion: string,
    validation: boolean,
    linting: boolean,
    rulesCache: Map<string, LinterMeta[]>,
  ): LinterMeta[] {
    const cached = rulesCache.get(symbol);
    if (cached) return cached;

    let meta: LinterMeta[] = [];
    const metadataMap = doc.meta.get('metadataMap') as MetadataMap | undefined;
    const symbolMetadata = metadataMap?.[symbol];
    const elementMeta = symbolMetadata?.lint;
    if (elementMeta) {
      meta = meta.concat(elementMeta);
      meta = meta.filter((r) => {
        const matchesCategory = DefaultValidationService.matchesCategory(validation, linting, r);
        return (
          !r.given &&
          matchesCategory &&
          DefaultValidationService.matchesTargetSpecs(r, docNs, specVersion)
        );
      });
    }
    // get namespace rules with `given` populated as array
    try {
      if (!this.settings?.metadata?.rules) {
        rulesCache.set(symbol, meta);
        return meta;
      }
      const rules = this.settings?.metadata?.rules;
      if (!rules[docNs]?.lint) {
        rulesCache.set(symbol, meta);
        return meta;
      }
      meta = meta.concat(
        rules[docNs]!.lint!.filter((r) => {
          const matchesCategory = DefaultValidationService.matchesCategory(validation, linting, r);
          if (!matchesCategory) return false;
          if (!DefaultValidationService.matchesTargetSpecs(r, docNs, specVersion)) return false;
          const matchesArray =
            r.given !== undefined &&
            Array.isArray(r.given) &&
            r.given.includes(symbol) &&
            (!r.givenFormat || r.givenFormat === LinterGivenFormat.SEMANTIC);
          if (matchesArray) {
            return true;
          }
          const matchesString =
            r.given !== undefined &&
            typeof r.given === 'string' &&
            r.given === symbol &&
            (!r.givenFormat || r.givenFormat === LinterGivenFormat.SEMANTIC);
          return matchesString;
        }),
      );
    } catch (e) {
      error('error in retrieving semantic rules', e);
    }
    rulesCache.set(symbol, meta);
    return meta;
  }

  private static buildReferenceErrorMessageFromResult(
    result: PromiseSettledResult<Element | { error: Error; refEl: Element }>,
  ): string | boolean {
    // @ts-ignore
    if (!result.value) {
      return false;
    }
    // @ts-ignore
    if (!result.value?.error) {
      return false;
    }
    // @ts-ignore
    let errorCause = result.value?.error.cause;
    while (errorCause?.cause) {
      errorCause = errorCause.cause;
    }
    const pointerString = errorCause.jsonPointer ? ` at "${errorCause.jsonPointer}"` : '';
    // @ts-ignore
    if (errorCause.message) {
      return `${errorCause.name}: ${errorCause.message}`;
    }
    return errorCause.name + pointerString;
  }

  private static buildReferenceErrorMessageFromError(ex: unknown): string | boolean {
    // @ts-ignore
    let errorCause = ex.cause;
    while (errorCause?.cause) {
      errorCause = errorCause.cause;
    }
    const pointerString = errorCause.jsonPointer ? ` at "${errorCause.jsonPointer}"` : '';

    if (errorCause.message) {
      return `${errorCause.name}: ${errorCause.message}`;
    }
    return errorCause.name + pointerString;
  }

  private async validateReferencesConcurrent(
    refElements: Element[],
    result: Element,
    doc: Element,
    textDocument: TextDocument,
    nameSpace: ContentLanguage,
    validationContext?: ValidationContext,
  ): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];
    const pointersMap: Record<string, Pointer[]> = {};
    const derefPromises: Promise<Element | { error: Error; refEl: Element }>[] = [];

    const baseURI = validationContext?.baseURI
      ? validationContext?.baseURI
      : 'https://speclynx.com/';
    const apiReference = new Reference({ uri: baseURI, value: cloneDeep(result)! });
    const cachedParsers = options.parse.parsers.map(DefaultValidationService.createCachedParser);

    for (const [fragmentId, refEl] of refElements.entries()) {
      const referenceElementReference = new Reference({
        uri: `${baseURI}#reference${fragmentId}`,
        value: refEl,
      });
      const refSet = new ReferenceSet({ refs: [referenceElementReference, apiReference] });

      try {
        const promise = dereferenceApiDOM(refEl, {
          resolve: {
            baseURI: `${baseURI}#reference${fragmentId}`,
            external: !(toValue((refEl as ObjectElement).get('$ref')) as string).startsWith('#'),
          },
          parse: {
            parsers: cachedParsers,
            mediaType: nameSpace.mediaType,
          },
          dereference: {
            refSet,
            immutable: false,
          },
        }).catch((e: Error) => {
          return { error: e, refEl };
        });
        derefPromises.push(promise);
      } catch (ex) {
        error('error preparing dereferencing', ex);
      }
    }
    try {
      const derefResults = await Promise.allSettled(derefPromises);
      for (const derefResult of derefResults) {
        const message = DefaultValidationService.buildReferenceErrorMessageFromResult(derefResult);
        if (message) {
          // @ts-ignore
          const refElement = derefResult.value?.refEl;
          if (refElement as Element) {
            const refValueElement = (refElement as ObjectElement).get('$ref')!;
            const referencedElement = getReferencedElementValue(refElement);
            let pointers = pointersMap[referencedElement];
            if (!pointers) {
              pointers = localReferencePointers(doc, referencedElement, true);

              pointersMap[referencedElement] = pointers;
            }
            const lintSm = getSourceMap(refValueElement);
            const location = { offset: lintSm.offset, length: lintSm.length };
            const range = Range.create(
              textDocument.positionAt(location.offset),
              textDocument.positionAt(location.offset + location.length),
            );
            const code = `${location.offset.toString()}-${location.length.toString()}-${Date.now()}`;
            const diagnostic = Diagnostic.create(
              range,
              `Reference Error - ${message}`,
              DiagnosticSeverity.Error,
              code,
              'apilint',
            );

            diagnostic.source = 'apilint';
            diagnostic.data = {
              quickFix: [],
            } as LinterMetaData;
            for (const p of pointers) {
              // @ts-ignore
              if (refValueElement !== p.ref && !p.isRef) {
                diagnostic.data.quickFix.push({
                  message: `update to ${p.ref}`,
                  action: 'updateValue',
                  functionParams: [p.ref],
                });
              }
            }
            this.quickFixesMap[code] = diagnostic.data.quickFix;
            diagnostics.push(diagnostic);
          }
        }
      }
    } catch (ex) {
      error('error dereferencing', ex);
    }
    return diagnostics;
  }

  private async validateReferencesSequential(
    refElements: Element[],
    result: Element,
    doc: Element,
    textDocument: TextDocument,
    nameSpace: ContentLanguage,
    validationContext?: ValidationContext,
  ): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];
    const pointersMap: Record<string, Pointer[]> = {};

    const baseURI = validationContext?.baseURI
      ? validationContext?.baseURI
      : 'https://speclynx.com/';
    const apiReference = new Reference({ uri: baseURI, value: cloneDeep(result) });
    const cachedParsers = options.parse.parsers.map(DefaultValidationService.createCachedParser);

    for (const [fragmentId, refEl] of refElements.entries()) {
      const referenceElementReference = new Reference({
        uri: `${baseURI}#reference${fragmentId}`,
        value: refEl,
      });
      const refSet = new ReferenceSet({ refs: [referenceElementReference, apiReference] });

      try {
        await dereferenceApiDOM(refEl, {
          resolve: {
            baseURI: `${baseURI}#reference${fragmentId}`,
            external: !(toValue((refEl as ObjectElement).get('$ref')) as string).startsWith('#'),
          },
          parse: {
            mediaType: nameSpace.mediaType,
            parsers: cachedParsers,
          },
          dereference: {
            refSet,
            immutable: false,
          },
        });
      } catch (ex) {
        const message = DefaultValidationService.buildReferenceErrorMessageFromError(ex);
        if (message) {
          // @ts-ignore
          if (refEl as Element) {
            const refValueElement = (refEl as ObjectElement).get('$ref');
            const referencedElement = getReferencedElementValue(refEl);
            let pointers = pointersMap[referencedElement];
            if (!pointers) {
              pointers = localReferencePointers(doc, referencedElement, true);

              pointersMap[referencedElement] = pointers;
            }
            const lintSm = getSourceMap(refValueElement!);
            const location = { offset: lintSm.offset, length: lintSm.length };
            const range = Range.create(
              textDocument.positionAt(location.offset),
              textDocument.positionAt(location.offset + location.length),
            );
            const code = `${location.offset.toString()}-${location.length.toString()}-${Date.now()}`;
            const diagnostic = Diagnostic.create(
              range,
              `Reference Error - ${message}`,
              DiagnosticSeverity.Error,
              code,
              'apilint',
            );

            diagnostic.source = 'apilint';
            diagnostic.data = {
              quickFix: [],
            } as LinterMetaData;
            for (const p of pointers) {
              // @ts-ignore
              if (refValueElement !== p.ref && !p.isRef) {
                diagnostic.data.quickFix.push({
                  message: `update to ${p.ref}`,
                  action: 'updateValue',
                  functionParams: [p.ref],
                });
              }
            }
            this.quickFixesMap[code] = diagnostic.data.quickFix;
            diagnostics.push(diagnostic);
          }
        }
      }
    }
    return diagnostics;
  }

  private static resolveValidationMode(
    context?: ValidationContext,
    settingsContext?: ValidationContext,
  ): {
    semanticValidationEnabled: boolean;
    semanticRefValidationEnabled: boolean;
    semanticLintingEnabled: boolean;
    jsonSchemaValidationEnabled: boolean;
    betterAjvErrors: boolean;
  } {
    let semanticValidationEnabled =
      !settingsContext || !(settingsContext.semanticValidation === false);
    if (context && context.semanticValidation !== undefined) {
      semanticValidationEnabled = context.semanticValidation;
    }
    let semanticRefValidationEnabled =
      !settingsContext || !(settingsContext.referenceValidation === false);
    if (context && context.referenceValidation !== undefined) {
      semanticRefValidationEnabled = context.referenceValidation;
    }
    let semanticLintingEnabled = !settingsContext || !(settingsContext.semanticLinting === false);
    if (context && context.semanticLinting !== undefined) {
      semanticLintingEnabled = context.semanticLinting;
    }
    let jsonSchemaValidationEnabled = settingsContext?.jsonSchemaValidation || false;
    if (context && context.jsonSchemaValidation !== undefined) {
      jsonSchemaValidationEnabled = context.jsonSchemaValidation;
    }
    let betterAjvErrors = settingsContext?.betterAjvErrors || false;
    if (context && context.betterAjvErrors !== undefined) {
      betterAjvErrors = context.betterAjvErrors;
    }
    return {
      semanticValidationEnabled,
      semanticRefValidationEnabled,
      semanticLintingEnabled,
      jsonSchemaValidationEnabled,
      betterAjvErrors,
    };
  }

  public async doValidation(
    textDocument: TextDocument,

    validationContext?: ValidationContext,
  ): Promise<Diagnostic[]> {
    perfStart(PerfLabels.START);
    const context = !validationContext ? this.settings?.validationContext : validationContext;
    const {
      semanticValidationEnabled,
      semanticRefValidationEnabled,
      jsonSchemaValidationEnabled,
      semanticLintingEnabled,
      betterAjvErrors,
    } = DefaultValidationService.resolveValidationMode(context, this.settings?.validationContext);
    if (validationContext) {
      // TODO (frantuma) remove this when we have a better way to pass the context

      validationContext.betterAjvErrors = betterAjvErrors;
    }
    const exclusiveJsonSchemaValidation =
      jsonSchemaValidationEnabled &&
      !semanticValidationEnabled &&
      !semanticRefValidationEnabled &&
      !semanticLintingEnabled;
    info(`semanticValidationEnabled: ${semanticValidationEnabled}`);
    info(`semanticRefValidationEnabled: ${semanticRefValidationEnabled}`);
    info(`jsonSchemaValidationEnabled: ${jsonSchemaValidationEnabled}`);
    info(`semanticLintingEnabled: ${semanticLintingEnabled}`);
    const refValidationMode =
      !context || !context.referenceValidationMode
        ? ReferenceValidationMode.LEGACY
        : context.referenceValidationMode | ReferenceValidationMode.LEGACY;
    const refValidationSerialProcessing =
      !context || !context.referenceValidationSequentialProcessing
        ? false
        : context.referenceValidationSequentialProcessing;
    const text: string = textDocument.getText();
    const diagnostics: Diagnostic[] = [];
    const nameSpace = await findNamespace(text, this.settings?.defaultContentLanguage);
    let docNs: string = nameSpace.namespace;

    try {
      for (const provider of this.validationProviders) {
        if (
          (provider.overrideDefaultValidation() ||
            (exclusiveJsonSchemaValidation && provider.jsonSchemaValidation())) &&
          provider
            .namespaces()
            .some(
              (ns) => ns.namespace === nameSpace.namespace && ns.version === nameSpace.version,
            ) &&
          provider.doValidation &&
          (!provider.providerMode || provider.providerMode() === ProviderMode.FULL)
        ) {
          await this.executeValidationProvider(
            provider,
            docNs,
            nameSpace.version!,
            textDocument,
            diagnostics,
            context,
          );
          return diagnostics;
        }
      }
    } catch (e) {
      error('error in overriding validation provider', e);
    }
    if (!semanticValidationEnabled && !semanticRefValidationEnabled && !semanticLintingEnabled) {
      return diagnostics;
    }
    this.quickFixesMap = {};
    let result = await this.settings!.documentCache?.get(
      textDocument,
      undefined,
      'doValidation-parse-first',
    );
    if (!result) return diagnostics;

    let processedText;
    // no API document has been parsed
    if (result.annotations) {
      for (const annotation of result.annotations) {
        if (
          context &&
          context.maxNumberOfProblems &&
          diagnostics.length > context.maxNumberOfProblems
        ) {
          return diagnostics;
        }
        const nodeSourceMap = getSourceMap(annotation);
        let location = { offset: nodeSourceMap.offset, length: nodeSourceMap.length };
        if (
          nameSpace.format === 'YAML' &&
          nodeSourceMap.offset === 0 &&
          nodeSourceMap.endLine &&
          nodeSourceMap.endColumn
        ) {
          // workaround "whole doc" YAML grammar error
          location = {
            offset: textDocument.offsetAt({ line: nodeSourceMap.endLine, character: 0 }),
            length: nodeSourceMap.endColumn,
          };
        }

        const range = Range.create(
          textDocument.positionAt(location.offset),
          textDocument.positionAt(location.offset + location.length),
        );
        let message: string = toValue(annotation) as string;
        if (
          message.startsWith(text.substring(0, text.length > 10 ? 10 : text.length)) &&
          message.length > 70
        ) {
          message = `YAML Syntax error: '... ${message.substring(20)}'`;
        }

        const diagnostic = Diagnostic.create(range, message, DiagnosticSeverity.Error, 0, 'syntax');
        if (context && context.relatedInformation) {
          diagnostic.relatedInformation = [
            {
              location: {
                uri: textDocument.uri,
                range: { ...diagnostic.range },
              },
              message: 'Syntax error while parsing',
            },
            {
              location: {
                uri: textDocument.uri,
                range: { ...diagnostic.range },
              },
              message: 'more things',
            },
          ];
        }

        diagnostics.push(diagnostic);
      }
      processedText = correctPartialKeys(result, textDocument, await isJsonDoc(textDocument));
    }
    if (processedText) {
      docNs = (await findNamespace(processedText, this.settings?.defaultContentLanguage)).namespace;
      result = await this.settings!.documentCache?.get(
        textDocument,
        processedText,
        'doValidation-parse-second',
      );
    }
    if (!result) return diagnostics;
    const { api } = result;
    if (api === undefined) return diagnostics;
    const specVersion = getSpecVersion(api);

    const hasSyntaxErrors = !!diagnostics.length;

    const pointersMap: Record<string, Pointer[]> = {};
    const lintReference = (
      doc: Element,
      referencedElement: string,
      refValueElement: Element,
    ): Diagnostic[] => {
      const refDiagnostics: Diagnostic[] = [];
      if (
        refValidationMode === ReferenceValidationMode.LEGACY &&
        (toValue(refValueElement) as string).startsWith('#')
      ) {
        let pointers = pointersMap[referencedElement];
        if (!pointers) {
          pointers = localReferencePointers(doc, referencedElement, true);
          pointersMap[referencedElement] = pointers;
        }
        if (!pointers.some((p) => p.ref === (toValue(refValueElement) as string))) {
          // local ref not found
          const lintSm = getSourceMap(refValueElement);
          const location = { offset: lintSm.offset, length: lintSm.length };
          const range = Range.create(
            textDocument.positionAt(location.offset),
            textDocument.positionAt(location.offset + location.length),
          );
          const code = `${location.offset.toString()}-${location.length.toString()}-${Date.now()}`;
          const diagnostic = Diagnostic.create(
            range,
            'local reference not found',
            DiagnosticSeverity.Error,
            code,
            'apilint',
          );

          diagnostic.source = 'apilint';
          diagnostic.data = {
            quickFix: [],
          } as LinterMetaData;
          for (const p of pointers) {
            // @ts-ignore
            if (refValueElement !== p.ref && !p.isRef) {
              diagnostic.data.quickFix.push({
                message: `update to ${p.ref}`,
                action: 'updateValue',
                functionParams: [p.ref],
              });
            }
          }
          this.quickFixesMap[code] = diagnostic.data.quickFix;

          refDiagnostics.push(diagnostic);
        }
      }
      try {
        // TODO (frantuma@yahoo.com)  try using the "repaired" version of the doc (serialize apidom skipping errors and missing)
        for (const provider of this.validationProviders) {
          if (
            provider
              .namespaces()
              .some((ns) => ns.namespace === docNs && ns.version === specVersion) &&
            provider.doRefValidation &&
            provider.providerMode &&
            provider.providerMode() === ProviderMode.REF
          ) {
            const validationProviderResult = provider.doRefValidation(
              textDocument,
              api,
              refValueElement,
              referencedElement,
              toValue(refValueElement) as string,
              refDiagnostics,
              context,
            );
            switch (validationProviderResult.mergeStrategy) {
              case MergeStrategy.APPEND:
                refDiagnostics.push(...validationProviderResult.diagnostics);
                break;
              case MergeStrategy.PREPEND:
                refDiagnostics.unshift(...validationProviderResult.diagnostics);
                break;
              case MergeStrategy.REPLACE:
                refDiagnostics.splice(
                  0,
                  diagnostics.length,
                  ...validationProviderResult.diagnostics,
                );
                break;
              case MergeStrategy.IGNORE:
                break;
              default:
                refDiagnostics.push(...validationProviderResult.diagnostics);
            }

            if (validationProviderResult.quickFixes) {
              for (const fix in validationProviderResult.quickFixes) {
                this.quickFixesMap[fix] = validationProviderResult.quickFixes[fix];
              }
            }
            if (provider.break()) {
              break;
            }
          }
        }
      } catch (e) {
        error('error in validation provider', e);
      }
      return refDiagnostics;
    };

    const refElements: Element[] = [];
    const rulesCache = new Map<string, LinterMeta[]>();

    const lint = (path: Path<Element>) => {
      const element = path.node;
      const referencedElement = getReferencedElementValue(element);
      if (
        referencedElement.length > 0 &&
        isObject(element) &&
        element.hasKey('$ref') &&
        (refValidationMode === ReferenceValidationMode.APIDOM_INDIRECT_EXTERNAL ||
          (toValue(element.get('$ref')) as string).startsWith('#'))
      ) {
        refElements.push(element);
      }
      if (referencedElement.length > 0) {
        // legacy lint local references
        if (isObject(element) && element.hasKey('$ref')) {
          if (semanticRefValidationEnabled) {
            // TODO get ref value from metadata or in adapter
            diagnostics.push(...lintReference(api, referencedElement, element.get('$ref')!));
          }
        }
      }
      if (element.classes) {
        // Build deduplicated symbol set for rule lookup
        const seen = new Set<string>();
        const symbols: string[] = ['*'];
        seen.add('*');

        if (referencedElement.length > 0 && !seen.has(referencedElement)) {
          symbols.push(referencedElement);
          seen.add(referencedElement);
        }
        if (!seen.has(element.element)) {
          symbols.push(element.element);
          seen.add(element.element);
        }
        for (const cls of element.classes as string[]) {
          if (!seen.has(cls)) {
            symbols.push(cls);
            seen.add(cls);
          }
        }

        if (semanticValidationEnabled || semanticLintingEnabled) {
          for (const s of symbols) {
            const semanticLintingRules = this.getLintingRulesSemantic(
              api,
              s,
              docNs,
              specVersion,
              semanticValidationEnabled,
              semanticLintingEnabled,
              rulesCache,
            );
            for (const meta of semanticLintingRules) {
              this.processRule(meta, diagnostics, textDocument, api, element, docNs, specVersion);
            }
          }
        }
      }
    };
    forEach(api, lint);
    if (refValidationMode !== ReferenceValidationMode.LEGACY && semanticRefValidationEnabled) {
      if (refValidationSerialProcessing) {
        diagnostics.push(
          ...(await this.validateReferencesSequential(
            refElements,
            result,
            api,
            textDocument,
            nameSpace,
            context,
          )),
        );
      } else {
        diagnostics.push(
          ...(await this.validateReferencesConcurrent(
            refElements,
            result,
            api,
            textDocument,
            nameSpace,
            context,
          )),
        );
      }
    }
    try {
      const rules = this.settings?.metadata?.rules;
      if (rules && rules[docNs]?.lint) {
        for (const r of rules[docNs]!.lint!) {
          const matchesCategory = DefaultValidationService.matchesCategory(
            semanticValidationEnabled,
            semanticLintingEnabled,
            r,
          );
          if (
            r.givenFormat !== undefined &&
            r.givenFormat === LinterGivenFormat.JSONPATH &&
            matchesCategory
          ) {
            const matchesArray = r.given !== undefined && Array.isArray(r.given);
            if (matchesArray) {
              for (const givenItem of r.given as string[]) {
                const elements: Element[] = evaluate(api, givenItem);
                elements.forEach((el) => {
                  this.processRule(r, diagnostics, textDocument, api, el, docNs, specVersion);
                });
              }
            }
            const matchesString = r.given !== undefined && typeof r.given === 'string';
            if (matchesString) {
              const elements: Element[] = evaluate(api, r.given as string);
              if (elements && elements.length > 0) {
                for (const ruleElement of elements) {
                  this.processRule(
                    r,
                    diagnostics,
                    textDocument,
                    api,
                    ruleElement,
                    docNs,
                    specVersion,
                  );
                }
              }
            }
          }
        }
      }
    } catch (e) {
      error('error in retrieving jsonpath rules', e);
    }
    perfEnd(PerfLabels.START);
    if (!hasSyntaxErrors) {
      // TODO try using the "repaired" version of the doc (serialize apidom skipping errors and missing)
      for (const provider of this.validationProviders) {
        if (!(provider.jsonSchemaValidation() && !jsonSchemaValidationEnabled)) {
          await this.executeValidationProvider(
            provider,
            docNs,
            specVersion,
            textDocument,
            diagnostics,
            context,
            api,
          );
          if (provider.break()) {
            break;
          }
        }
      }
    }

    return diagnostics;
  }

  private processRule(
    meta: LinterMeta,
    diagnostics: Diagnostic[],
    textDocument: TextDocument,
    api: Element,
    element: Element,
    docNs: string,
    specVersion: string,
  ): void {
    if (!DefaultValidationService.matchesTargetSpecs(meta, docNs, specVersion)) {
      return;
    }
    const linterFuncName = meta.linterFunction;
    if (linterFuncName) {
      // first check if it is a standard function and exists.
      let lintFunc = standardLinterfunctionsMap.get(linterFuncName);
      // else get it from configuration
      if (!lintFunc) {
        lintFunc = this.settings?.metadata?.linterFunctions[docNs][linterFuncName];
      }
      if (lintFunc) {
        try {
          let lintRes = true;
          if (
            meta.target &&
            meta.target.length > 0 &&
            isObject(element) &&
            !element.hasKey(meta.target)
          ) {
            return;
          }
          const targetElement =
            meta.target && meta.target.length > 0 && isObject(element)
              ? element.hasKey(meta.target)
                ? element.get(meta.target)
                : element
              : element;

          const conditionsSuccess = checkConditions(meta, docNs, element, api, this.settings);
          if (conditionsSuccess) {
            if (
              meta.linterParams &&
              Array.isArray(meta.linterParams) &&
              meta.linterParams.length > 0
            ) {
              const params = [targetElement].concat(meta.linterParams);
              lintRes = lintFunc(...params) as boolean;
            } else {
              lintRes = lintFunc(targetElement) as boolean;
            }
            if (meta.negate) lintRes = !lintRes;
            if (!lintRes) {
              // add to diagnostics - compute source map lazily (only on failure)
              let lintSm = getSourceMap(element);
              // check if root
              if (!element.parent || element.parent.element === 'parseResult') {
                // TODO use create
                lintSm = {
                  offset: 0,
                  endOffset: textDocument.getText().length < 6 ? textDocument.getText().length : 5,
                  length: textDocument.getText().length < 6 ? textDocument.getText().length : 5,
                  column: 0,
                  endColumn: 0,
                  endLine: 0,
                  line: 0,
                };
              }
              if (meta.target) {
                if (isObject(element) && element.hasKey(meta.target)) {
                  if (meta.marker === 'key') {
                    lintSm = getSourceMap(element.getMember(meta.target)!.key as Element);
                  } else if (meta.marker === 'value') {
                    lintSm = getSourceMap(element.get(meta.target) as Element);
                  }
                }
              }
              let markerElement: Element = element;
              if (meta.markerTarget && meta.markerTarget.length > 0) {
                if (isObject(element) && element.hasKey(meta.markerTarget)) {
                  markerElement = element.get(meta.markerTarget)!;
                }
              }
              if (meta.marker === 'key') {
                const { parent } = markerElement;
                if (parent && isMember(parent) && parent.key !== markerElement) {
                  lintSm = getSourceMap(parent.key as Element);
                }
              }
              const location = { offset: lintSm.offset, length: lintSm.length };
              const range = Range.create(
                textDocument.positionAt(location.offset),
                textDocument.positionAt(location.offset + location.length),
              );
              const diagnostic = Diagnostic.create(
                range,

                meta.message!,
                meta.severity,
                meta.code,
              );
              diagnostic.source = meta.source;
              if (meta.data) {
                diagnostic.data = meta.data;
              }
              diagnostics.push(diagnostic);
            }
          }
        } catch (e) {
          error('validation lint error', JSON.stringify(e), e);
        }
      }
    }
  }

  // try to retrieve data from diagnostic from client, if not present use metadata
  // e.g. Monaco doesn't support `data` property
  private async executeValidationProvider(
    provider: ValidationProvider,
    docNs: string,
    specVersion: string,
    textDocument: TextDocument,
    diagnostics: Diagnostic[],
    context?: ValidationContext,
    api?: Element,
  ): Promise<void> {
    if (
      provider.namespaces().some((ns) => ns.namespace === docNs && ns.version === specVersion) &&
      provider.doValidation &&
      (!provider.providerMode || provider.providerMode() === ProviderMode.FULL)
    ) {
      const validationProviderResult = await provider.doValidation(
        textDocument,
        diagnostics,
        context,
        api,
      );
      switch (validationProviderResult.mergeStrategy) {
        case MergeStrategy.APPEND:
          diagnostics.push(...validationProviderResult.diagnostics);
          break;
        case MergeStrategy.PREPEND:
          diagnostics.unshift(...validationProviderResult.diagnostics);
          break;
        case MergeStrategy.REPLACE:
          diagnostics.splice(0, diagnostics.length, ...validationProviderResult.diagnostics);
          break;
        case MergeStrategy.IGNORE:
          break;
        default:
          diagnostics.push(...validationProviderResult.diagnostics);
      }
      if (validationProviderResult.quickFixes) {
        for (const fix in validationProviderResult.quickFixes) {
          this.quickFixesMap[fix] = validationProviderResult.quickFixes[fix];
        }
      }
    }
  }

  private findQuickFix(
    diagnostic: Diagnostic,
    lang: string,
    code: string,
  ): QuickFixData[] | undefined {
    // @ts-ignore
    if (diagnostic.data?.quickFix) {
      // @ts-ignore
      return diagnostic.data?.quickFix;
    }
    const quicks = this.quickFixesMap[code];
    if (quicks) {
      // delete this.quickFixesMap[code];
      return quicks;
    }

    if (diagnostic.source === APIDOM_LINTER) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const map: MetadataMap = this.settings?.metadata?.metadataMaps[lang]!;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [symbolKey, symbolValue] of Object.entries(map)) {
        if (symbolValue.lint) {
          const linters: LinterMeta[] = symbolValue.lint as LinterMeta[];
          for (const linterMeta of linters) {
            // TODO (frantuma@yahoo.com)  solve LinterMeta number/string

            if (String(linterMeta.code!) === code) {
              return linterMeta.data?.quickFix;
            }
          }
        }
      }
    }
    return undefined;
  }

  public async doCodeActions(
    textDocument: TextDocument,
    parmsOrDiagnostics: CodeActionParams | Diagnostic[],
  ): Promise<CodeAction[]> {
    const diagnostics =
      'context' in parmsOrDiagnostics ? parmsOrDiagnostics.context.diagnostics : parmsOrDiagnostics;
    const documentUri =
      'textDocument' in parmsOrDiagnostics ? parmsOrDiagnostics.textDocument.uri : textDocument.uri;
    if (!diagnostics.length) {
      return Promise.resolve([]);
    }
    if (!textDocument) {
      return Promise.resolve([]);
    }

    const text: string = textDocument.getText();
    const lang: string = (await findNamespace(textDocument, this.settings?.defaultContentLanguage))
      .namespace;

    const isJsonDocument = await isJsonDoc(text);
    return this.settings!.documentCache!.get(textDocument, undefined, 'doCodeActions').then(
      (result) => {
        if (!result) {
          return [];
        }
        const { api } = result;
        if (!api) {
          return [];
        }
        const codeActions: CodeAction[] = [];
        // TODO deduplicate, action maps elsewhere
        diagnostics.forEach((diag) => {
          const quickFixes = this.findQuickFix(diag, lang, String(diag.code));
          if (quickFixes) {
            for (const quickFix of quickFixes) {
              if (quickFix.action === 'updateValue') {
                let newText: string | undefined;
                if (quickFix.function === 'transformToLowercase') {
                  newText = textDocument.getText(diag.range).toLowerCase();
                } else if (!quickFix.function) {
                  if (quickFix.functionParams && quickFix.functionParams.length > 0) {
                    [newText] = quickFix.functionParams;
                  }
                }
                const oldText = textDocument.getText(diag.range);
                const oldTextquotes =
                  oldText.charAt(0) === '"' || oldText.charAt(0) === "'"
                    ? oldText.charAt(0)
                    : undefined;
                const quotedInsertText =
                  newText && oldTextquotes && newText.startsWith(oldTextquotes);
                if (oldTextquotes && !quotedInsertText) {
                  newText = oldTextquotes + newText + oldTextquotes;
                }
                if (newText || newText === '') {
                  codeActions.push({
                    // @ts-ignore
                    title: quickFix.message,
                    kind: CodeActionKind.QuickFix,
                    diagnostics: [diag],
                    edit: {
                      changes: {
                        [documentUri]: [
                          {
                            range: diag.range,
                            newText,
                          },
                        ],
                      },
                    },
                  });
                }
              } else if (quickFix.action === 'addChild') {
                // TODO (frantuma@yahoo.com)  functions as linter from client, defined elsewhere
                // if (quickFix.function === 'addDescription') {
                // TODO (frantuma@yahoo.com)  use apidom node to add a child  whenroundtrip serialization gets supported
                const newText = isJsonDocument ? quickFix.snippetJson : quickFix.snippetYaml;

                // get the range of 0 length for the same line + 1
                const line = diag.range.start.line + 1;
                // get the char with indent
                // TODO (frantuma@yahoo.com)  better indent handling
                const character = diag.range.start.character + 2;
                const range = Range.create({ line, character }, { line, character });
                // TODO (frantuma@yahoo.com)  caret is not moved to $1 like in completion, use a command or something
                codeActions.push({
                  // @ts-ignore
                  title: quickFix.message,
                  kind: CodeActionKind.QuickFix,
                  diagnostics: [diag],
                  edit: {
                    changes: {
                      [documentUri]: [
                        {
                          range,
                          newText: newText || '',
                        },
                      ],
                    },
                  },
                });
              } else if (quickFix.action === 'removeChild') {
                // @ts-ignore
                const [target] = quickFix.functionParams;
                // get element from range
                const offset = textDocument.offsetAt(diag.range.start);
                // find the current node
                let node = findAtOffset(api, { offset: offset + 1, includeRightBound: true })?.node;
                if (quickFix.target && node) {
                  const targetEl = processPath(node, quickFix.target, api);
                  if (targetEl) {
                    node = targetEl;
                  }
                }
                if (node && isObject(node) && node.hasKey(target)) {
                  // range of child value
                  const targetSm = getSourceMap(node.getMember(target)!);
                  const location = { offset: targetSm.offset, length: targetSm.length };
                  const targetRange = Range.create(
                    textDocument.positionAt(location.offset),
                    textDocument.positionAt(location.offset + location.length),
                  );
                  codeActions.push({
                    // @ts-ignore
                    title: quickFix.message,
                    kind: CodeActionKind.QuickFix,
                    diagnostics: [diag],
                    edit: {
                      changes: {
                        [documentUri]: [
                          {
                            range: targetRange,
                            newText: '',
                          },
                        ],
                      },
                    },
                  });
                }
              }
            }
          }
        });

        return codeActions;
      },
    );
  }
}
