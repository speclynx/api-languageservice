# Parameter Object - Phase 3 Audit

## Specification Analysis

The Parameter Object (Section 4.6.6) defines 3 fields. The `in` field allows values `"path"`, `"query"`, `"header"`, or `"cookie"`.

## Bug Fix

The `in--equals` rule incorrectly included `"body"` as a valid value. The Arazzo specification only defines four valid values for the `in` field: `"path"`, `"query"`, `"header"`, and `"cookie"`. The `"body"` value is not part of the Arazzo specification (it may have been carried over from an OpenAPI convention). Fixed by removing `"body"` from the allowed values list.

## Total Rules After Phase 3: 6 (unchanged, bug fix only)
