import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { browserBundle } from '../../../../scripts/webpack-browser-bundle.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export default [
  browserBundle({
    packageName: '@speclynx/api-languageservice',
    filename: 'api-languageservice.browser.min.js',
    library: 'apiLanguageService',
    recoveredDirectory: path.join(here, '..', 'licenses'),
    inventoryPath: path.resolve('./THIRD-PARTY-INVENTORY.tsv'),
  }),
];
