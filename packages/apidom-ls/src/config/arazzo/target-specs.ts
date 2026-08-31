/**
 * @public
 */
export const Arazzo100 = [{ namespace: 'arazzo', version: '1.0.0' }];
/**
 * @public
 */
export const Arazzo101 = [{ namespace: 'arazzo', version: '1.0.1' }];

/**
 * @public
 */
export const Arazzo10X = [{ namespace: 'arazzo', version: '1.0.x' }];

/**
 * @public
 */
// `Arazzo10X`'s `1.0.x` prefix-matches every 1.0 patch version (`matchesTargetSpecs` treats an
// `x`-suffixed version as a prefix match), which already subsumes the exact `Arazzo100`/
// `Arazzo101` entries - they're kept as separate exported constants for API compatibility, but
// not spread in here since they'd add nothing `Arazzo10X` doesn't already match. Every
// version-split (`-1-0.ts`) rule targets this constant (or the `Arazzo`/`Arazzo1` aggregate that
// includes it), specifically so it doesn't go dark for an unenumerated 1.0.x document.
export const Arazzo10 = [...Arazzo10X];

/**
 * @public
 */
export const Arazzo110 = [{ namespace: 'arazzo', version: '1.1.0' }];

/**
 * @public
 */
export const Arazzo11X = [{ namespace: 'arazzo', version: '1.1.x' }];

/**
 * @public
 */
// Same rationale as `Arazzo10` above, for the 1.1 line.
export const Arazzo11 = [...Arazzo11X];

/**
 * @public
 */
export const Arazzo1 = [...Arazzo10, ...Arazzo11];

/**
 * @public
 */
export const Arazzo = [...Arazzo1];
