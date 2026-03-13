import conditionRequiredLint from './condition--required.ts';
import conditionTypeLint from './condition--type.ts';
import contextTypeLint from './context--type.ts';
import typeEqualsLint from './type--equals.ts';
import contextRequiredWhenTypeLint from './context--required-when-type.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  conditionRequiredLint,
  conditionTypeLint,
  contextTypeLint,
  typeEqualsLint,
  contextRequiredWhenTypeLint,
  allowedFieldsLint,
];

export default lints;
