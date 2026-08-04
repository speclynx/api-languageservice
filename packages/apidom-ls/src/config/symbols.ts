import asyncapiSymbols from './asyncapi/symbols.ts';
import openapiSymbols from './openapi/symbols.ts';

// creating list of unique symbols
const symbols = Array.from(new Set([...asyncapiSymbols, ...openapiSymbols]));

export default symbols;
