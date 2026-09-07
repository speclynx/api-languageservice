import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { browserBundle } from '../../../../scripts/webpack-browser-bundle.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.join(here, '..', '..', '..', '..');

export default [
  browserBundle({
    packageName: '@speclynx/apidom-ls',
    // The filename and global the old package advertised. A CDN consumer is
    // following unpkg.com/@speclynx/apidom-ls and has never heard of the new
    // name, so both have to survive the rename byte for byte.
    filename: 'apidom-ls.browser.min.js',
    library: 'apidomLs',
    recoveredDirectory: path.join(here, '..', 'licenses'),
    inventoryPath: path.resolve('./THIRD-PARTY-INVENTORY.tsv'),
    // The package this one wraps keeps its licence under LICENSES/ rather than
    // at its root, and the workspace copy does not even have that until
    // `prepack` puts it there — so the text is supplied from the one canonical
    // copy in the repository rather than looked for beside the bundled module.
    licenseTextOverrides: {
      '@speclynx/api-languageservice': fs.readFileSync(
        path.join(repositoryRoot, 'LICENSES', 'Apache-2.0.txt'),
        'utf8',
      ),
    },
  }),
];
