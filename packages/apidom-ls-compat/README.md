# @speclynx/apidom-ls

This package has been renamed. It is now published as
[`@speclynx/api-languageservice`](https://www.npmjs.com/package/@speclynx/api-languageservice),
and its source lives at https://github.com/speclynx/api-languageservice.

Version 2.13.0 of `@speclynx/apidom-ls` is a compatibility release. It contains no code of its
own: it depends on `@speclynx/api-languageservice` and forwards every entry point the old package
advertised — the CommonJS and ES module roots, the type declarations, all twelve
`services/validation/providers/*` subpaths, and the UMD browser bundle at
`dist/apidom-ls.browser.min.js` with its `apidomLs` global. Upgrading to it is a no-op, and it is
published so that nothing breaks on the day of the rename.

## Migrating

Change the dependency and the import specifier; nothing else moves.

```sh
npm uninstall @speclynx/apidom-ls
npm install @speclynx/api-languageservice
```

```diff
-import { getLanguageService } from '@speclynx/apidom-ls';
+import { getLanguageService } from '@speclynx/api-languageservice';
```

Subpath imports change the same way:

```diff
-import { OpenAPi31JsonSchemaValidationProvider } from '@speclynx/apidom-ls/services/validation/providers/openapi-31-json-schema';
+import { OpenAPi31JsonSchemaValidationProvider } from '@speclynx/api-languageservice/services/validation/providers/openapi-31-json-schema';
```

Browser consumers loading the bundle from a CDN change the package in the URL, and the global
from `apidomLs` to `apiLanguageService`:

```diff
-<script src="https://unpkg.com/@speclynx/apidom-ls"></script>
+<script src="https://unpkg.com/@speclynx/api-languageservice"></script>
```

The API itself is unchanged. There is no code change beyond the name.

## End of life

`@speclynx/apidom-ls` receives security fixes and nothing else until **2027-03-21**. After that
date it receives nothing at all. Because this release forwards to
`@speclynx/api-languageservice@^2.13.0`, a security fix published there reaches you through your
existing version range without a new release of this package.

Everything else — new features, bug fixes, new specification versions — happens in
`@speclynx/api-languageservice` only, starting with 2.13.0.

## License

Licensed under the [Apache 2.0 license](https://github.com/speclynx/api-languageservice/blob/main/LICENSES/Apache-2.0.txt).
This package ships an explicit `NOTICE` file containing additional legal notices, and a
`dist/THIRD-PARTY-NOTICES.txt` listing the open source software bundled into its browser bundle.
