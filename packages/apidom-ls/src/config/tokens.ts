import adsTokens from './ads/tokens.ts';
import arazzoTokens from './arazzo/tokens.ts';
import asyncapiTokens from './asyncapi/tokens.ts';
import openapiTokens from './openapi/tokens.ts';
import overlayTokens from './overlay/tokens.ts';

// creating list of unique tokens
const tokens = Array.from(
  new Set([
    'value',
    'string',
    'number',
    'key',
    ...adsTokens,
    ...asyncapiTokens,
    ...openapiTokens,
    ...arazzoTokens,
    ...overlayTokens,
  ]),
);

export default tokens;
