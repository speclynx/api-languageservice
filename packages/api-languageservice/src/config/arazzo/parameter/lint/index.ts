import nameRequiredLint from './name--required.ts';
import nameTypeLint from './name--type.ts';
import inTypeLint from './in--type.ts';
import inEquals10Lint from './in--equals-1-0.ts';
import inEquals11Lint from './in--equals-1-1.ts';
import valueRequiredLint from './value--required.ts';
import valueRuntimeExpressionLint from './value--runtime-expression.ts';
import parameterUniqueLint from './unique.ts';
import allowedFieldsLint from './allowed-fields.ts';

const lints = [
  nameRequiredLint,
  nameTypeLint,
  parameterUniqueLint,
  inTypeLint,
  inEquals10Lint,
  inEquals11Lint,
  valueRequiredLint,
  valueRuntimeExpressionLint,
  allowedFieldsLint,
];

export default lints;
