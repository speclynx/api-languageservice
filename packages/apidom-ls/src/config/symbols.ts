import adsSymbols from './ads/symbols.ts';
import asyncapiSymbols from './asyncapi/symbols.ts';
import openapiSymbols from './openapi/symbols.ts';
import arazzoSymbols from './arazzo/symbols.ts';

// creating list of unique symbols
const symbols = Array.from(
  new Set([...adsSymbols, ...asyncapiSymbols, ...openapiSymbols, ...arazzoSymbols]),
);

export default symbols;
