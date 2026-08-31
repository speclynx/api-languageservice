import typeRequiredLint from './type--required.ts';
import typeTypeLint from './type--type.ts';
import typeEquals10Lint from './type--equals-1-0.ts';
import typeEquals11Lint from './type--equals-1-1.ts';
import versionRequired10Lint from './version--required-1-0.ts';
import versionTypeLint from './version--type.ts';
import versionEqualsJsonpathLint from './version--equals-jsonpath.ts';
import versionEqualsXpathLint from './version--equals-xpath.ts';
import versionEqualsJsonpointerLint from './version--equals-jsonpointer.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  typeRequiredLint,
  typeTypeLint,
  typeEquals10Lint,
  typeEquals11Lint,
  versionRequired10Lint,
  versionTypeLint,
  versionEqualsJsonpathLint,
  versionEqualsXpathLint,
  versionEqualsJsonpointerLint,
  allowedFieldsLint,
];

export default lints;
