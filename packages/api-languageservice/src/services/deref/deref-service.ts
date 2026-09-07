import { TextDocument } from 'vscode-languageserver-textdocument';
import { isString } from 'ramda-adjunct';
import { Element, ObjectElement } from '@speclynx/apidom-datamodel';
import { filter } from '@speclynx/apidom-traverse';
import { toJSON, toString, toYAML, toValue } from '@speclynx/apidom-core';
import { dereferenceApiDOM } from '@speclynx/apidom-reference';

import { DerefContext, Format, LanguageSettings } from '../../apidom-language-types.ts';
import { parse } from '../../parser-factory.ts';
import { isJsonDoc } from '../../utils/utils.ts';

export interface DerefService {
  doDeref(textDocument: TextDocument, derefContext: DerefContext): Promise<string>;

  configure(settings?: LanguageSettings): void;
}

export class DefaultDerefService implements DerefService {
  private settings: LanguageSettings | undefined;

  public configure(settings?: LanguageSettings): void {
    this.settings = settings;
  }

  public async doDeref(
    textDocument: TextDocument,

    derefContext?: DerefContext,
  ): Promise<string> {
    const context = !derefContext ? this.settings?.derefContext : derefContext;
    const text: string = textDocument.getText();

    const textFormat = (await isJsonDoc(text)) ? Format.JSON : Format.YAML;

    const result = await parse(
      text,
      this.settings?.metadata?.metadataMaps,
      false,
      false,
      false,
      this.settings?.defaultContentLanguage,
    );

    const api: ObjectElement = <ObjectElement>result.api;

    // no API document has been parsed
    if (api === undefined) return '';

    let baseURI: string | undefined = '/foo';

    const servers: Element[] = filter(api, (path) => {
      return (path.node.classes as string[]).includes('servers');
    }).map((path) => path.node);

    // TODO (frantuma@yahoo.com): this needs to be replaced by good metadata ('serverURL' to URLS and/or adapter/plugin
    if (servers && servers.length > 0) {
      const serversValue = toValue(servers[0]) as Record<string, unknown>;
      // OAS
      if (Array.isArray(serversValue)) {
        if (servers.length > 0) {
          const firstServer = serversValue[0] as Record<string, string>;
          baseURI = firstServer.url;
        }
        // ASYNC
      } else if (Object.keys(serversValue).length > 0) {
        const firstServer = serversValue[Object.keys(serversValue)[0]] as Record<string, string>;
        baseURI = firstServer.url;
      }
    }
    baseURI = isString(context?.baseURI) ? context?.baseURI : baseURI;
    const format =
      typeof context?.format !== 'undefined' && context.format in Format
        ? context.format
        : textFormat;

    // dereference
    const dereferenced = await dereferenceApiDOM(api, {
      resolve: {
        baseURI,
        resolverOpts: {
          fileAllowList: ['*'],
        },
      },
    });
    return format === Format.JSON
      ? toJSON(dereferenced, undefined, 2)
      : format === Format.YAML
        ? toYAML(dereferenced)
        : toString(dereferenced);
  }
}
