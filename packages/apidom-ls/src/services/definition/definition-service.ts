import { TextDocument } from 'vscode-languageserver-textdocument';
import { Element, ObjectElement, MemberElement } from '@speclynx/apidom-datamodel';
import { findAtOffset } from '@speclynx/apidom-traverse';
import { toValue } from '@speclynx/apidom-core';
import { Location, Range } from 'vscode-languageserver-types';
import { DefinitionParams, ReferenceParams } from 'vscode-languageserver-protocol';
import {
  evaluate as jsonPointerEvaluate,
  URIFragmentIdentifier,
} from '@speclynx/apidom-json-pointer';
import { dereferenceApiDOM } from '@speclynx/apidom-reference';

import { LanguageSettings } from '../../apidom-language-types.ts';
import {
  findNamespace,
  getSourceMap,
  getSpecVersion,
  isArray,
  isMember,
  isObject,
  debug,
  buildPointer,
  buildJsonPointer,
  findLocalReferences,
} from '../../utils/utils.ts';

export interface DefinitionService {
  doProvideDefinition(
    textDocument: TextDocument,
    definitionParams: DefinitionParams,
  ): Promise<Location | null>;

  doProvideReferences(
    textDocument: TextDocument,
    referenceParams: ReferenceParams,
  ): Promise<Location[] | null>;

  configure(settings?: LanguageSettings): void;
}

export class DefaultDefinitionService implements DefinitionService {
  private settings: LanguageSettings | undefined;

  public configure(settings?: LanguageSettings): void {
    this.settings = settings;
  }

  public async doProvideDefinition(
    textDocument: TextDocument,
    definitionParams: DefinitionParams,
  ): Promise<Location | null> {
    const offset = textDocument.offsetAt(definitionParams.position);
    const result = await this.settings!.documentCache?.get(textDocument);
    if (!result) return null;
    const api: ObjectElement = <ObjectElement>result.api;

    // no API document has been parsed
    if (api === undefined) return null;
    // TODO (frantuma@yahoo.com): handle by predicates and adapters, look for
    // refElements and/or metadata, replace current shaky handling by `$ref` key lookup
    const node = findAtOffset(api, { offset, includeRightBound: true });
    if (node && node.parent && isMember(node.parent)) {
      let el: Element;
      if (!isObject(node) && isArray(node)) {
        el = node;
      } else {
        el = (<MemberElement>node.parent).key as ObjectElement;
      }
      if (toValue(el) !== '$ref') {
        return null;
      }

      const ref = toValue(node) as string;
      // TODO (frantuma@yahoo.com): handle by URL parsing
      if (!ref.startsWith('#') && node.parent?.parent) {
        try {
          // TODO full multi files support
          // TODO get media type from initial parsing
          const contentLanguage = await findNamespace(
            textDocument.getText(),
            this.settings?.defaultContentLanguage,
          );
          const specVersion = getSpecVersion(api);

          const format = contentLanguage.format ? contentLanguage.format.toLowerCase() : 'json';
          const mediaTypePrefix =
            contentLanguage.namespace === 'openapi'
              ? 'application/vnd.oai.openapi+'
              : 'application/vnd.aai.asyncapi+';
          const mediaType = `${mediaTypePrefix}${format};version=${specVersion}`;
          debug(
            'definitionService - go to external ref',
            `mediaType: ${mediaType}`,
            `textDocument.uri: ${textDocument.uri}`,
            `node value: ${JSON.stringify(toValue(node))}`,
            `parent value: ${JSON.stringify(toValue(node.parent.parent))}`,
          );
          const dereferenced = await dereferenceApiDOM(node.parent.parent, {
            parse: { mediaType, parserOpts: { sourceMap: true } },
            resolve: {
              baseURI: textDocument.uri,
              resolverOpts: {
                fileAllowList: ['*'],
              },
            },
          });
          debug(
            'definitionService - go to external ref',
            `dereferenced value: ${toValue(dereferenced)}`,
          );
          const newUri = toValue(dereferenced.meta.get('ref-origin')) as string;
          debug('definitionService - go to external ref', `dereferenced file URI: ${newUri}`);
          const nodeSourceMap = getSourceMap(dereferenced);
          const range = Range.create(
            {
              line: nodeSourceMap.line,
              character: nodeSourceMap.column,
            },
            {
              line: nodeSourceMap.endLine || nodeSourceMap.line,
              character: nodeSourceMap.endColumn || nodeSourceMap.column + 1,
            },
          );
          return {
            uri: newUri,
            range,
          };
        } catch {
          return null;
        }
      }
      // TODO (frantuma@yahoo.com): replace with fragment deref
      const refTarget = jsonPointerEvaluate<Element>(
        api,
        URIFragmentIdentifier.from(ref as string),
      );
      const nodeSourceMap = getSourceMap(refTarget);
      const range = Range.create(
        textDocument.positionAt(nodeSourceMap.offset),
        textDocument.positionAt(nodeSourceMap.endOffset || nodeSourceMap.offset + 1),
      );
      return {
        uri: textDocument.uri,
        range,
      };
    }
    return null;
  }

  public async doProvideReferences(
    textDocument: TextDocument,
    referenceParams: ReferenceParams,
  ): Promise<Location[] | null> {
    const offset = textDocument.offsetAt(referenceParams.position);

    const result = await this.settings!.documentCache?.get(textDocument);
    if (!result) return null;
    const api: ObjectElement = <ObjectElement>result.api;

    // no API document has been parsed
    if (api === undefined) return null;

    // TODO(frantuma@yahoo.com): handle by predicates and adapters, look for
    // refElements and/or metadata, replace current shaky handling by `$ref` key lookup
    const node = findAtOffset(api, { offset, includeRightBound: true });
    if (node && node.parent && isMember(node.parent)) {
      const nodePath: string[] = [];
      buildPointer(node, nodePath);
      const jsonPointer = buildJsonPointer(nodePath);
      const pointers = findLocalReferences(api, jsonPointer);
      if (pointers.length === 0) {
        return null;
      }
      const locations: Location[] = [];
      for (const pointer of pointers) {
        const nodeSourceMap = getSourceMap(pointer.node);
        const range = Range.create(
          textDocument.positionAt(nodeSourceMap.offset),
          textDocument.positionAt(nodeSourceMap.endOffset || nodeSourceMap.offset + 1),
        );
        locations.push({
          uri: textDocument.uri,
          range,
        });
      }
      return locations;
    }
    return null;
  }
}
