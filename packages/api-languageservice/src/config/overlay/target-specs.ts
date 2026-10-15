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
export const Overlay120 = [{ namespace: 'overlay', version: '1.2.0' }];

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
export const Overlay12 = [...Overlay120];

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
export const Overlay12X = [{ namespace: 'overlay', version: '1.2.x' }];

/**
 * @public
 */
export const Overlay1 = [...Overlay10, ...Overlay11, ...Overlay12];

/**
 * @public
 */
export const Overlay = [...Overlay1];
