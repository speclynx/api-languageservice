import contextTypeLint from './context--type.ts';
import selectorTypeLint from './selector--type.ts';
import typeTypeLint from './type--type.ts';
import typeEqualsLint from './type--equals.ts';
import allowedFieldsLint from './allowed-fields.ts';

// Note: `context`, `selector` and `type` have no "required" rules here. apidom only
// disambiguates an object as a `selector` element once all three of those fields are already
// present (see OAI/Arazzo-Specification#519), so a "required" check on any of them could never
// fire - an incomplete object simply isn't parsed as `selector` in the first place.
const lints = [contextTypeLint, selectorTypeLint, typeTypeLint, typeEqualsLint, allowedFieldsLint];

export default lints;
