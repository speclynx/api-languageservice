import nameRequiredLint from './name--required.ts';
import nameTypeLint from './name--type.ts';
import namePatternLint from './name--pattern.ts';
import urlRequiredLint from './url--required.ts';
import urlTypeLint from './url--type.ts';
import typeTypeLint from './type--type.ts';
import typeEquals10Lint from './type--equals-1-0.ts';
import typeEquals11Lint from './type--equals-1-1.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  nameRequiredLint,
  nameTypeLint,
  namePatternLint,
  urlRequiredLint,
  urlTypeLint,
  typeTypeLint,
  typeEquals10Lint,
  typeEquals11Lint,
  allowedFieldsLint,
];

export default lints;
