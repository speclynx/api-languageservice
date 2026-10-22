import { TextDocument } from 'vscode-languageserver-textdocument';
import { isString } from 'ramda-adjunct';
import {
  Element,
  ObjectElement,
  isArrayElement,
  isObjectElement,
} from '@speclynx/apidom-datamodel';
import { filter } from '@speclynx/apidom-traverse';
import { toJSON, toString, toYAML } from '@speclynx/apidom-core';
import { dereferenceApiDOM } from '@speclynx/apidom-reference';

import { DerefContext, Format, LanguageSettings } from '../../apidom-language-types.ts';
import { parse } from '../../parser-factory.ts';
import { isJsonDoc, toValue } from '../../utils/utils.ts';

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
    let firstServer: Element | undefined;
    // OAS
    if (isArrayElement(servers[0])) {
      firstServer = servers[0].first;
      // ASYNC
    } else if (isObjectElement(servers[0])) {
      firstServer = servers[0].first?.value;
    }
    // a server without a url, or with one that is not a string, leaves the default
    const url = isObjectElement(firstServer) ? toValue(firstServer.get('url')) : undefined;
    if (isString(url)) {
      baseURI = url;
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
