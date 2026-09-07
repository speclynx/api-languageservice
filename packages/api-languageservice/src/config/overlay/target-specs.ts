/**
 * @public
 */
export const Overlay100 = [{ namespace: 'overlay', version: '1.0.0' }];
/**
 * @public
 */
export const Overlay110 = [{ namespace: 'overlay', version: '1.1.0' }];

/**
 * @public
 */
export const Overlay10 = [...Overlay100];
/**
 * @public
 */
export const Overlay11 = [...Overlay110];

/**
 * @public
 */
export const Overlay10X = [{ namespace: 'overlay', version: '1.0.x' }];
/**
 * @public
 */
export const Overlay11X = [{ namespace: 'overlay', version: '1.1.x' }];

/**
 * @public
 */
export const Overlay1 = [...Overlay10, ...Overlay11];

/**
 * @public
 */
export const Overlay = [...Overlay1];
