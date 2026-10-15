import { DiagnosticSeverity } from 'vscode-languageserver-types';

import overlay1Meta from './overlay1/meta.ts';
import infoMeta from './info/meta.ts';
import actionMeta from './action/meta.ts';
import componentsMeta from './components/meta.ts';
import reusableActionMeta from './reusable-action/meta.ts';
import reusableActionReferenceMeta from './reusable-action-reference/meta.ts';
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
  overlay1: overlay1Meta,
  info: infoMeta,
  action: actionMeta,
  components: componentsMeta,
  reusableAction: reusableActionMeta,
  reusableActionReference: reusableActionReferenceMeta,
};
