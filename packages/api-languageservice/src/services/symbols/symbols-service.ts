import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range, SymbolInformation } from 'vscode-languageserver-protocol';
import { Element, MemberElement } from '@speclynx/apidom-datamodel';
import { filter } from '@speclynx/apidom-traverse';
import { toValue } from '@speclynx/apidom-core';
import { SymbolKind } from 'vscode-languageserver-types';

import { buildPath, getSourceMap, isMember, SourceMap } from '../../utils/utils.ts';
import { LanguageSettings, SymbolsContext } from '../../apidom-language-types.ts';

export interface SymbolsService {
  doFindDocumentSymbols(
    document: TextDocument,
    symbolsContext?: SymbolsContext,
  ): Promise<SymbolInformation[]>;

  configure(settings?: LanguageSettings): void;
}

export class DefaultSymbolsService implements SymbolsService {
  private settings: LanguageSettings | undefined;

  public configure(settings?: LanguageSettings): void {
    this.settings = settings;
  }

  protected isMeaningfulIdentifier(id: string): boolean {
    if (this.settings?.metadata?.symbols && this.settings.metadata.symbols.includes(id)) {
      return true;
    }
    return false;
  }

  public async doFindDocumentSymbols(
    textDocument: TextDocument,

    symbolsContext?: SymbolsContext,
  ): Promise<SymbolInformation[]> {
    // TODO use added metadata instead of classes and stuff
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const context = !symbolsContext ? this.settings?.symbolsContext : symbolsContext;
    const result = await this.settings!.documentCache?.get(textDocument);
    if (!result) return [];
    const { api } = result;
    // if we cannot parse nothing to do
    if (api === undefined) return [];

    const symbols: SymbolInformation[] = [];

    const res: Element[] = filter(api, (path) => {
      const el = path.node;
      return (
        (el.classes as string[]).some((item: string) => this.isMeaningfulIdentifier(item)) ||
        this.isMeaningfulIdentifier(el.element)
      );
    }).map((path) => path.node);

    for (let index = 0; index < res.length; ++index) {
      const e = res[index];
      const set: string[] = Array.from(new Set(e.classes as string[]));
      // add element value to the set (e.g. 'pathItem', 'operation'
      if (!set.includes(e.element)) {
        set.unshift(e.element);
      }
      set.forEach((s) => {
        if (this.isMeaningfulIdentifier(s)) {
          let sm: SourceMap;
          if (e.parent && isMember(e.parent) && e.parent.key) {
            sm = getSourceMap(e.parent.key as Element);
          } else {
            sm = getSourceMap(e);
          }
          const r = Range.create(
            { line: sm.line, character: sm.column },
            { line: sm.endLine || sm.line, character: sm.endColumn || sm.column },
          );

          //  TODO (frantuma@yahoo.com) replace with ns plugin/adapter
          if (s === 'operation') {
            const si: SymbolInformation = SymbolInformation.create(
              s,
              SymbolKind.Property,
              r,
              textDocument.uri,
            );
            // TODO solve this
            const superParent: MemberElement = e.parent!.parent!.parent as MemberElement;
            const keySuper = superParent.key as Element;
            const keyValueSuper = toValue(keySuper) as string;
            const parent: MemberElement = e.parent as MemberElement;
            const key = parent.key as Element;
            const keyValue = toValue(key) as string;
            si.containerName = `${keyValueSuper} -> ${keyValue}`;
            symbols.push(si);
          } else if (s === 'pathItem' || s === 'channelItem') {
            const si: SymbolInformation = SymbolInformation.create(
              s,
              SymbolKind.Property,
              r,
              textDocument.uri,
            );
            const parent: MemberElement = e.parent as MemberElement;
            const key = parent.key as Element;
            si.containerName = toValue(key) as string;
            symbols.push(si);
          } else {
            const si: SymbolInformation = SymbolInformation.create(
              s,
              SymbolKind.Property,
              r,
              textDocument.uri,
            );
            const path = buildPath(e);
            si.containerName = path;
            symbols.push(si);
          }
        }
      });
    }
    return symbols;
  }
}
