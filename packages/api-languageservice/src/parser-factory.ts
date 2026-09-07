import * as openapi2AdapterJson from '@speclynx/apidom-parser-adapter-openapi-json-2';
import * as openapi2AdapterYaml from '@speclynx/apidom-parser-adapter-openapi-yaml-2';
import * as openapi3_0AdapterJson from '@speclynx/apidom-parser-adapter-openapi-json-3-0';
import * as openapi3_0AdapterYaml from '@speclynx/apidom-parser-adapter-openapi-yaml-3-0';
import * as openapi3_1AdapterJson from '@speclynx/apidom-parser-adapter-openapi-json-3-1';
import * as openapi3_1AdapterYaml from '@speclynx/apidom-parser-adapter-openapi-yaml-3-1';
import * as asyncapi2AdapterJson from '@speclynx/apidom-parser-adapter-asyncapi-json-2';
import * as asyncapi2AdapterYaml from '@speclynx/apidom-parser-adapter-asyncapi-yaml-2';
import * as arazzo1AdapterJson from '@speclynx/apidom-parser-adapter-arazzo-json-1';
import * as arazzo1AdapterYaml from '@speclynx/apidom-parser-adapter-arazzo-yaml-1';
import * as overlay1AdapterJson from '@speclynx/apidom-parser-adapter-overlay-json-1';
import * as overlay1AdapterYaml from '@speclynx/apidom-parser-adapter-overlay-yaml-1';
import { parseSourceDescriptions as parseArazzoSourceDescriptionsJson } from '@speclynx/apidom-reference/parse/parsers/arazzo-json-1';
import { parseSourceDescriptions as parseArazzoSourceDescriptionsYaml } from '@speclynx/apidom-reference/parse/parsers/arazzo-yaml-1';
import * as adapterJson from '@speclynx/apidom-parser-adapter-json';
import * as adapterYaml from '@speclynx/apidom-parser-adapter-yaml-1-2';
import { refractorPluginReplaceEmptyElement as refractorPluginReplaceEmptyElementAsyncAPI2 } from '@speclynx/apidom-ns-asyncapi-2';
import { refractorPluginReplaceEmptyElement as refractorPluginReplaceEmptyElementOpenAPI2 } from '@speclynx/apidom-ns-openapi-2';
import { refractorPluginReplaceEmptyElement as refractorPluginReplaceEmptyElementOpenAPI3_0 } from '@speclynx/apidom-ns-openapi-3-0';
import { refractorPluginReplaceEmptyElement as refractorPluginReplaceEmptyElementOpenAPI3_1 } from '@speclynx/apidom-ns-openapi-3-1';
import { refractorPluginReplaceEmptyElement as refractorPluginReplaceEmptyElementArazzo1 } from '@speclynx/apidom-ns-arazzo-1';
import { refractorPluginReplaceEmptyElement as refractorPluginReplaceEmptyElementOverlay1 } from '@speclynx/apidom-ns-overlay-1';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ParseResultElement } from '@speclynx/apidom-datamodel';
import {
  options as referenceOptions,
  mergeOptions as mergeReferenceOptions,
  url as referenceUrl,
} from '@speclynx/apidom-reference';

import { setMetadataMap, findNamespace } from './utils/utils.ts';
import { ContentLanguage, MetadataMaps, ParseContext } from './apidom-language-types.ts';

export interface ParserOptions {
  sourceMap?: boolean;
  specObj?: string;
  parser?: unknown;
}

export async function parse(
  textDocument: TextDocument | string,
  metadataMaps: MetadataMaps | undefined,
  registerPlugins = true,
  freeze = true,
  setMetadata = true,
  defaultContentLanguage?: ContentLanguage,
  parseContext?: ParseContext,
): Promise<ParseResultElement> {
  // TODO improve detection mechanism
  const text: string = typeof textDocument === 'string' ? textDocument : textDocument.getText();
  let result;
  const contentLanguage = await findNamespace(text, defaultContentLanguage);
  if (contentLanguage.namespace === 'asyncapi' && contentLanguage.format === 'JSON') {
    result = await asyncapi2AdapterJson.parse(text, { sourceMap: true });
  } else if (contentLanguage.namespace === 'asyncapi' && contentLanguage.format === 'YAML') {
    const options: Record<string, unknown> = {
      sourceMap: true,
    };
    if (registerPlugins) {
      options.refractorOpts = { plugins: [refractorPluginReplaceEmptyElementAsyncAPI2()] };
    }
    result = await asyncapi2AdapterYaml.parse(text, options);
  } else if (
    contentLanguage.namespace === 'openapi' &&
    contentLanguage.version === '2.0' &&
    contentLanguage.format === 'JSON'
  ) {
    result = await openapi2AdapterJson.parse(text, { sourceMap: true });
  } else if (
    contentLanguage.namespace === 'openapi' &&
    contentLanguage.version === '2.0' &&
    contentLanguage.format === 'YAML'
  ) {
    const options: Record<string, unknown> = {
      sourceMap: true,
    };
    if (registerPlugins) {
      options.refractorOpts = { plugins: [refractorPluginReplaceEmptyElementOpenAPI2()] };
    }
    result = await openapi2AdapterYaml.parse(text, options);
  } else if (
    contentLanguage.namespace === 'openapi' &&
    contentLanguage.version?.startsWith('3.0') &&
    contentLanguage.format === 'JSON'
  ) {
    result = await openapi3_0AdapterJson.parse(text, { sourceMap: true });
  } else if (
    contentLanguage.namespace === 'openapi' &&
    contentLanguage.version?.startsWith('3.0') &&
    contentLanguage.format === 'YAML'
  ) {
    const options: Record<string, unknown> = {
      sourceMap: true,
    };
    if (registerPlugins) {
      options.refractorOpts = { plugins: [refractorPluginReplaceEmptyElementOpenAPI3_0()] };
    }
    result = await openapi3_0AdapterYaml.parse(text, options);
  } else if (
    contentLanguage.namespace === 'openapi' &&
    contentLanguage.version?.startsWith('3.1') &&
    contentLanguage.format === 'JSON'
  ) {
    result = await openapi3_1AdapterJson.parse(text, { sourceMap: true });
  } else if (
    contentLanguage.namespace === 'openapi' &&
    contentLanguage.version?.startsWith('3.1') &&
    contentLanguage.format === 'YAML'
  ) {
    const options: Record<string, unknown> = {
      sourceMap: true,
    };
    if (registerPlugins) {
      options.refractorOpts = { plugins: [refractorPluginReplaceEmptyElementOpenAPI3_1()] };
    }
    result = await openapi3_1AdapterYaml.parse(text, options);
  } else if (
    contentLanguage.namespace === 'arazzo' &&
    contentLanguage.version?.startsWith('1.') &&
    contentLanguage.format === 'JSON'
  ) {
    result = await arazzo1AdapterJson.parse(text, { sourceMap: true });
    if (parseContext?.arazzo?.sourceDescriptionsResolution && parseContext?.fileAllowList?.length) {
      const parseResultRetrievalURI =
        typeof textDocument === 'string' ? referenceUrl.cwd() : textDocument.uri;
      const sourceDescriptionsResults = await parseArazzoSourceDescriptionsJson(
        result,
        parseResultRetrievalURI,
        mergeReferenceOptions(referenceOptions, {
          parse: {
            parserOpts: {
              sourceMap: true,
              strict: false,
              sourceDescriptions: true,
            },
          },
          resolve: {
            resolverOpts: {
              fileAllowList: parseContext.fileAllowList,
            },
          },
        }),
      );
      result.push(...sourceDescriptionsResults);
    }
  } else if (
    contentLanguage.namespace === 'arazzo' &&
    contentLanguage.version?.startsWith('1.') &&
    contentLanguage.format === 'YAML'
  ) {
    const options: Record<string, unknown> = {
      sourceMap: true,
    };
    if (registerPlugins) {
      options.refractorOpts = { plugins: [refractorPluginReplaceEmptyElementArazzo1()] };
    }
    result = await arazzo1AdapterYaml.parse(text, options);
    if (parseContext?.arazzo?.sourceDescriptionsResolution && parseContext?.fileAllowList?.length) {
      const parseResultRetrievalURI =
        typeof textDocument === 'string' ? referenceUrl.cwd() : textDocument.uri;
      const sourceDescriptionsResults = await parseArazzoSourceDescriptionsYaml(
        result,
        parseResultRetrievalURI,
        mergeReferenceOptions(referenceOptions, {
          parse: {
            parserOpts: {
              sourceMap: true,
              strict: false,
              sourceDescriptions: true,
            },
          },
          resolve: {
            resolverOpts: {
              fileAllowList: parseContext.fileAllowList,
            },
          },
        }),
      );
      result.push(...sourceDescriptionsResults);
    }
  } else if (
    contentLanguage.namespace === 'overlay' &&
    contentLanguage.version?.startsWith('1.') &&
    contentLanguage.format === 'JSON'
  ) {
    result = await overlay1AdapterJson.parse(text, { sourceMap: true });
  } else if (
    contentLanguage.namespace === 'overlay' &&
    contentLanguage.version?.startsWith('1.') &&
    contentLanguage.format === 'YAML'
  ) {
    const options: Record<string, unknown> = {
      sourceMap: true,
    };
    if (registerPlugins) {
      options.refractorOpts = { plugins: [refractorPluginReplaceEmptyElementOverlay1()] };
    }
    result = await overlay1AdapterYaml.parse(text, options);
  } else if (contentLanguage.namespace === 'apidom' && contentLanguage.format === 'JSON') {
    result = await adapterJson.parse(text, { sourceMap: true });
  } else if (contentLanguage.namespace === 'apidom' && contentLanguage.format === 'YAML') {
    result = await adapterYaml.parse(text, { sourceMap: true });
  } else {
    // fallback
    result = await adapterJson.parse(text, { sourceMap: true });
  }
  const { api } = result;
  if (api === undefined) return result;
  const docNs = contentLanguage.namespace;
  // TODO use the type related metadata at root level defining the tokenTypes and modifiers
  if (setMetadata) {
    setMetadataMap(api, docNs, metadataMaps); // TODO move to parser/adapter, extending the one standard
  }
  if (freeze) {
    api.freeze(); // !! freeze and add parent !!
  }

  return result;
}
