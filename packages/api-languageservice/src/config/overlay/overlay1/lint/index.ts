import overlayRequiredLint from './overlay--required.ts';
import overlayTypeLint from './overlay--type.ts';
import overlayPattern10Lint from './overlay--pattern-1-0.ts';
import overlayPattern11Lint from './overlay--pattern-1-1.ts';
import overlayPattern12Lint from './overlay--pattern-1-2.ts';
import selfTypeLint from './$self--type.ts';
import selfFormatURILint from './$self--format-uri.ts';
import selfNoFragmentLint from './$self--no-fragment.ts';
import infoRequiredLint from './info--required.ts';
import infoTypeLint from './info--type.ts';
import extendsTypeLint from './extends--type.ts';
import extendsFormatURILint from './extends--format-uri.ts';
import extendsNoFragmentLint from './extends--no-fragment.ts';
import actionsRequiredLint from './actions--required.ts';
import actionsTypeLint from './actions--type.ts';
import actionsType12Lint from './actions--type-1-2.ts';
import actionsNonEmptyLint from './actions--non-empty.ts';
import componentsTypeLint from './components--type.ts';
import allowedFieldsLint from './allowed-fields.ts';
import allowedFields12Lint from './allowed-fields-1-2.ts';

const lints = [
  overlayRequiredLint,
  overlayTypeLint,
  overlayPattern10Lint,
  overlayPattern11Lint,
  overlayPattern12Lint,
  selfTypeLint,
  selfFormatURILint,
  selfNoFragmentLint,
  infoRequiredLint,
  infoTypeLint,
  extendsTypeLint,
  extendsFormatURILint,
  extendsNoFragmentLint,
  actionsRequiredLint,
  actionsTypeLint,
  actionsType12Lint,
  actionsNonEmptyLint,
  componentsTypeLint,
  allowedFieldsLint,
  allowedFields12Lint,
];

export default lints;
