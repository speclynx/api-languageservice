import allowedFieldsOpenAPI2_0Lint from './allowed-fields-openapi-2-0.ts';
import allowedFieldsOpenAPI3_0Lint from './allowed-fields-openapi-3-0.ts';
import $idFormatURILint from './$id--format-uri.ts';
import $refValidLint from './$ref--valid.ts';
import $refNoSiblingsLint from './$ref--no-siblings.ts';
import additionalItemsNonArrayLint from './additional-items--non-array.ts';
import additionalItemsTypeLint from './additional-items--type.ts';
import additionalPropertiesNonObject from './additional-properties--non-object.ts';
import additionalPropertiesTypeLint from './additional-properties--type.ts';
import allOfTypeLint from './all-of--type.ts';
import anyOfTypeLint from './any-of--type.ts';
import containsNonArrayLint from './contains--non-array.ts';
import containsTypeLint from './contains--type.ts';
import descriptionTypeLint from './description--type.ts';
import discriminatorExistInRequiredLint from './discriminator--exist-in-required.ts';
import elseNonIfLint from './else--non-if.ts';
import elseTypeLint from './else--type.ts';
import enumUniqueLint from './enum--unique.ts';
import examplesTypeLint from './examples--type.ts';
import exclusiveMaximumTypeNumberLint from './exclusive-maximum--type-number.ts';
import exclusiveMaximumTypeBooleanLint from './exclusive-maximum--type-boolean.ts';
import exclusiveMinimumTypeBooleanLint from './exclusive-minimum--type-boolean.ts';
import exclusiveMinimumTypeNumberLint from './exclusive-minimum--type-number.ts';
import xmlTypeLint from './xml--type.ts';
import externalDocsTypeLint from './external-docs--type.ts';
import formatTypeLint from './format--type.ts';
import ifNonThenLint from './if--non-then.ts';
import ifTypeLint from './if--type.ts';
import itemsNonArrayLint from './items--non-array.ts';
import itemsTypeLint from './items--type.ts';
import maxItemsNonArrayLint from './max-items--non-array.ts';
import maxItemsTypeLint from './max-items--type.ts';
import maxLengthNonStringLint from './max-length--non-string.ts';
import maxLengthTypeLint from './max-length--type.ts';
import maximumTypeLint from './maximum--type.ts';
import minItemsNonArrayLint from './min-items--non-array.ts';
import minItemsTypeLint from './min-items--type.ts';
import minLengthNonString from './min-length--non-string.ts';
import minLengthTypeLint from './min-length--type.ts';
import minPropertiesNonObjectLint from './min-properties--non-object.ts';
import minPropertiesTypeLint from './min-properties--type.ts';
import minimumTypeLint from './minimum--type.ts';
import missingCoreFieldsLint from './missing-core-fields.ts';
import multipleOfTypeLint from './multiple-of--type.ts';
import notTypeLint from './not--type.ts';
import nullableTypeLint from './nullable--type.ts';
import nullableNotRecommendedLint from './nullable--not-recommended.ts';
import oneOfTypeLint from './one-of--type.ts';
import patternTypeLint from './pattern--type.ts';
import patternPropertiesKeysRegexpLint from './pattern-properties--keys-regexp.ts';
import patternPropertiesNonObjectLint from './pattern-properties--non-object.ts';
import patternPropertiesTypeLint from './pattern-properties--type.ts';
import patternPropertiesValuesTypeLint from './pattern-properties--values-type.ts';
import propertiesTypeLint from './properties--type.ts';
import propertiesValuesTypeLint from './properties--values-type.ts';
import propertyNamesNonObjectLint from './property-names--non-object.ts';
import propertyNamesTypeLint from './property-names--type.ts';
import readOnlyTypeLint from './read-only--type.ts';
import requiredDefinedLint from './required--defined.ts';
import requiredNonObjectLint from './required--non-object.ts';
import requiredTypeLint from './required--type.ts';
import thenNonIfLint from './then--non-if.ts';
import thenTypeLint from './then--type.ts';
import titleTypeLint from './title--type.ts';
import typeTypeLint from './type--type.ts';
import typeEqualsLint from './type--equals.ts';
import uniqueItemsNonArrayLint from './unique-items--non-array.ts';
import uniqueItemsTypeLint from './unique-items--type.ts';
import writeOnlyTypeLint from './write-only--type.ts';
import exampleDeprecatedLint from './example--deprecated.ts';

const schemaLints = [
  allowedFieldsOpenAPI2_0Lint,
  allowedFieldsOpenAPI3_0Lint,
  $idFormatURILint,
  $refValidLint,
  $refNoSiblingsLint,
  additionalItemsNonArrayLint,
  additionalItemsTypeLint,
  additionalPropertiesNonObject,
  additionalPropertiesTypeLint,
  allOfTypeLint,
  anyOfTypeLint,
  containsNonArrayLint,
  containsTypeLint,
  descriptionTypeLint,
  discriminatorExistInRequiredLint,
  elseNonIfLint,
  elseTypeLint,
  enumUniqueLint,
  examplesTypeLint,
  exclusiveMaximumTypeNumberLint,
  exclusiveMaximumTypeBooleanLint,
  exclusiveMinimumTypeNumberLint,
  exclusiveMinimumTypeBooleanLint,
  xmlTypeLint,
  externalDocsTypeLint,
  formatTypeLint,
  ifNonThenLint,
  ifTypeLint,
  itemsNonArrayLint,
  itemsTypeLint,
  maxItemsNonArrayLint,
  maxItemsTypeLint,
  maxLengthNonStringLint,
  maxLengthTypeLint,
  maximumTypeLint,
  minItemsNonArrayLint,
  minItemsTypeLint,
  minLengthNonString,
  minLengthTypeLint,
  minPropertiesNonObjectLint,
  minPropertiesTypeLint,
  minimumTypeLint,
  missingCoreFieldsLint,
  multipleOfTypeLint,
  notTypeLint,
  nullableTypeLint,
  nullableNotRecommendedLint,
  oneOfTypeLint,
  patternTypeLint,
  patternPropertiesKeysRegexpLint,
  patternPropertiesNonObjectLint,
  patternPropertiesTypeLint,
  patternPropertiesValuesTypeLint,
  propertiesTypeLint,
  propertiesValuesTypeLint,
  propertyNamesNonObjectLint,
  propertyNamesTypeLint,
  readOnlyTypeLint,
  requiredDefinedLint,
  requiredNonObjectLint,
  requiredTypeLint,
  thenNonIfLint,
  thenTypeLint,
  titleTypeLint,
  typeTypeLint,
  typeEqualsLint,
  uniqueItemsNonArrayLint,
  uniqueItemsTypeLint,
  writeOnlyTypeLint,
  exampleDeprecatedLint,
];

export default schemaLints;
