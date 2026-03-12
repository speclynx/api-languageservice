import nameRequiredLint from './name--required.ts';
import nameTypeLint from './name--type.ts';
import inTypeLint from './in--type.ts';
import inEqualsLint from './in--equals.ts';
import valueRequiredLint from './value--required.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  nameRequiredLint,
  nameTypeLint,
  inTypeLint,
  inEqualsLint,
  valueRequiredLint,
  allowedFieldsLint,
];

export default lints;
