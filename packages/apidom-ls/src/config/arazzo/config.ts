import { DiagnosticSeverity } from 'vscode-languageserver-types';

import infoMeta from './info/meta.ts';
import schemaMeta from './JSONSchema/meta.ts';
import ApilintCodes from '../codes.ts';

export default {
  '*': {
    lint: [
      {
        code: ApilintCodes.DUPLICATE_KEYS,
        source: 'apilint',
        message: 'an object cannot contain duplicate keys',
        severity: DiagnosticSeverity.Error,
        linterFunction: 'apilintNoDuplicateKeys',
        marker: 'key',
      },
    ],
  },
  info: infoMeta,
  JSONSchema: schemaMeta,
};
