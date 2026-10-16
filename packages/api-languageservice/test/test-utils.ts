import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Diagnostic } from 'vscode-languageserver-types';
import YAML from 'yaml';

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

const fixturesDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

/**
 * Every JSON and YAML document under `fixtures` that parses, as the data a JSON Schema
 * validation provider validates; the ones that do not parse are left out.
 */
export const parsedFixtureDocuments = (): { file: string; data: unknown }[] =>
  fs
    .readdirSync(fixturesDirectory, { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.(json|ya?ml)$/.test(file))
    .flatMap((file) => {
      const text = fs.readFileSync(path.join(fixturesDirectory, file), 'utf8');
      try {
        const data = file.endsWith('.json')
          ? JSON.parse(text)
          : JSON.parse(JSON.stringify(YAML.parse(text, { logLevel: 'silent' })));
        return [{ file, data }];
      } catch {
        return [];
      }
    });
