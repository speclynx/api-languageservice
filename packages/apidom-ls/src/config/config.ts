import configAsyncAPI from './asyncapi/config.ts';
import configOpenAPI from './openapi/config.ts';
import configADS from './ads/config.ts';
import configJSONSchema202012 from './json-schema/2020-12/config.ts';
import configArazzo from './arazzo/config.ts';
import configOverlay from './overlay/config.ts';
import { apilintJSONPathRFC9535 } from './overlay/linter-functions.ts';
import { Metadata } from '../apidom-language-types.ts';
import symbols from './symbols.ts';
import tokens from './tokens.ts';

/**
 * @public
 */
// eslint-disable-next-line import/prefer-default-export
export function config(): Metadata {
  return {
    metadataMaps: {
      openapi: configOpenAPI,
      asyncapi: configAsyncAPI,
      ads: configADS,
      arazzo: configArazzo,
      overlay: configOverlay,
      'json-schema-2020-12': configJSONSchema202012,
    },
    linterFunctions: {
      overlay: {
        apilintJSONPathRFC9535,
      },
    },
    symbols,
    tokens,
  } as Metadata;
}
