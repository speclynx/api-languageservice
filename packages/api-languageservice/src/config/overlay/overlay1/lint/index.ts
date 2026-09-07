import overlayRequiredLint from './overlay--required.ts';
import overlayTypeLint from './overlay--type.ts';
import overlayPattern10Lint from './overlay--pattern-1-0.ts';
import overlayPattern11Lint from './overlay--pattern-1-1.ts';
import infoRequiredLint from './info--required.ts';
import infoTypeLint from './info--type.ts';
import extendsTypeLint from './extends--type.ts';
import extendsFormatURILint from './extends--format-uri.ts';
import actionsRequiredLint from './actions--required.ts';
import actionsTypeLint from './actions--type.ts';
import actionsNonEmptyLint from './actions--non-empty.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  overlayRequiredLint,
  overlayTypeLint,
  overlayPattern10Lint,
  overlayPattern11Lint,
  infoRequiredLint,
  infoTypeLint,
  extendsTypeLint,
  extendsFormatURILint,
  actionsRequiredLint,
  actionsTypeLint,
  actionsNonEmptyLint,
  allowedFieldsLint,
];

export default lints;
