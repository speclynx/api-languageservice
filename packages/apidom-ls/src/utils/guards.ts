import {
  DiagnosticCategory,
  LinterGivenFormat,
  type LinterMeta,
  type LinterMetaData,
  type LinterCondition,
  type LinterConditionTarget,
  type NamespaceVersion,
  type QuickFixData,
} from '../apidom-language-types.ts';

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

const isNamespaceVersion = (v: unknown): v is NamespaceVersion =>
  isObject(v) && isString(v.namespace) && isString(v.version);

const isLinterConditionTarget = (v: unknown): v is LinterConditionTarget =>
  isObject(v) &&
  (v.path === undefined || isString(v.path)) &&
  (v.clazz === undefined || isString(v.clazz));

const isLinterCondition = (v: unknown): v is LinterCondition =>
  isObject(v) &&
  isString(v.function) &&
  (v.negate === undefined || isBoolean(v.negate)) &&
  (v.params === undefined || Array.isArray(v.params) || true) &&
  (v.targets === undefined ||
    (Array.isArray(v.targets) && v.targets.every(isLinterConditionTarget)));

const isQuickFixData = (v: unknown): v is QuickFixData =>
  isObject(v) &&
  isString(v.message) &&
  isString(v.action) &&
  (v.function === undefined || isString(v.function)) &&
  (v.functionParams === undefined || Array.isArray(v.functionParams)) &&
  (v.snippetYaml === undefined || isString(v.snippetYaml)) &&
  (v.snippetJson === undefined || isString(v.snippetJson)) &&
  (v.target === undefined || isString(v.target));

const isLinterMetaData = (v: unknown): v is LinterMetaData =>
  isObject(v) &&
  (v.quickFix === undefined || (Array.isArray(v.quickFix) && v.quickFix.every(isQuickFixData)));

export default function isValidLinterMeta(obj: unknown): obj is LinterMeta {
  if (!isObject(obj)) return false;

  const o = obj as Record<string, unknown>;

  // ── primitive & enum fields ───────────────────────────────
  if (o.code !== undefined && !isNumber(o.code)) return false;
  if (o.message !== undefined && !isString(o.message)) return false;
  if (o.source !== undefined && !isString(o.source)) return false;
  if (o.severity !== undefined && !isNumber(o.severity)) return false;
  if (o.linterFunction !== undefined && !isString(o.linterFunction)) return false;
  if (o.marker !== undefined && !isString(o.marker)) return false;
  if (o.markerTarget !== undefined && !isString(o.markerTarget)) return false;
  if (o.target !== undefined && !isString(o.target)) return false;
  if (o.targetFields !== undefined && !isBoolean(o.targetFields)) return false;
  if (o.negate !== undefined && !isBoolean(o.negate)) return false;
  if (o.name !== undefined && !isString(o.name)) return false;
  if (o.description !== undefined && !isString(o.description)) return false;
  if (o.summary !== undefined && !isString(o.summary)) return false;
  if (o.recommended !== undefined && !isBoolean(o.recommended)) return false;

  if (
    o.category !== undefined &&
    !Object.values(DiagnosticCategory).includes(o.category as DiagnosticCategory)
  )
    return false;

  if (
    o.givenFormat !== undefined &&
    !Object.values(LinterGivenFormat).includes(o.givenFormat as LinterGivenFormat)
  )
    return false;

  if (o.given !== undefined) {
    if (isString(o.given)) {
      /* ok */
    } else if (Array.isArray(o.given) && o.given.every(isString)) {
      /* ok */
    } else {
      return false;
    }
  }
  if (o.targetSpecs !== undefined) {
    if (!Array.isArray(o.targetSpecs) || !o.targetSpecs.every(isNamespaceVersion)) {
      return false;
    }
  }

  if (o.conditions !== undefined) {
    if (!Array.isArray(o.conditions) || !o.conditions.every(isLinterCondition)) {
      return false;
    }
  }
  if (o.data !== undefined && !isLinterMetaData(o.data)) {
    return false;
  }

  return true;
}
