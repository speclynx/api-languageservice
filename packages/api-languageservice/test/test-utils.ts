import { Diagnostic } from 'vscode-languageserver-types';

import { LogLevel } from '../src/apidom-language-types.ts';

export function printJson(json: unknown) {
  console.log(JSON.stringify(json, null, 2));
}

export const logPerformance = false;
export const logLevel = LogLevel.WARN;

/*
LSP 3.18 widened `Diagnostic.message` to `string | MarkupContent`, so a diagnostic's text can no
longer be read straight off the property. Normalise instead of casting, so a MarkupContent message
is actually handled rather than asserted away.
 */
export const diagnosticText = (message: Diagnostic['message']): string =>
  typeof message === 'string' ? message : message.value;
