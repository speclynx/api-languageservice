/**
 * @public
 */
export const OpenAPI2 = [{ namespace: 'openapi', version: '2.0' }];

/**
 * @public
 */
export const OpenAPI300 = [{ namespace: 'openapi', version: '3.0.0' }];
/**
 * @public
 */
export const OpenAPI301 = [{ namespace: 'openapi', version: '3.0.1' }];
/**
 * @public
 */
export const OpenAPI302 = [{ namespace: 'openapi', version: '3.0.2' }];
/**
 * @public
 */
export const OpenAPI303 = [{ namespace: 'openapi', version: '3.0.3' }];
/**
 * @public
 */
export const OpenAPI304 = [{ namespace: 'openapi', version: '3.0.4' }];

/**
 * @public
 */
export const OpenAPI30 = [
  ...OpenAPI300,
  ...OpenAPI301,
  ...OpenAPI302,
  ...OpenAPI303,
  ...OpenAPI304,
];

/**
 * @public
 */
export const OpenAPI30X = [{ namespace: 'openapi', version: '3.0.x' }];
/**
 * @public
 */
export const OpenAPI31X = [{ namespace: 'openapi', version: '3.1.x' }];

/**
 * @public
 */
export const OpenAPI310 = [{ namespace: 'openapi', version: '3.1.0' }];
/**
 * @public
 */
export const OpenAPI311 = [{ namespace: 'openapi', version: '3.1.1' }];
/**
 * @public
 */
export const OpenAPI312 = [{ namespace: 'openapi', version: '3.1.2' }];
/**
 * @public
 */
export const OpenAPI31 = [...OpenAPI310, ...OpenAPI311, ...OpenAPI312];

/**
 * @public
 */
export const OpenAPI3 = [...OpenAPI30, ...OpenAPI31];
