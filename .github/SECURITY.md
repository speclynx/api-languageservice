# Security Policy

If you believe you've found an exploitable security issue in the SpecLynx API Language
Service,
**please don't create a public issue**.

## Reporting a vulnerability

To report a vulnerability please send an email with the details to [info@speclynx.com](mailto:info@speclynx.com).

We'll acknowledge receipt of your report ASAP, and set expectations on how we plan to handle it.

## Supported versions

Security fixes are made to the latest release of `@speclynx/api-languageservice`.

`@speclynx/apidom-ls`, the name this package was published under up to 2.12.0, is deprecated.
Its last release, 2.13.0, contains no code of its own: it depends on
`@speclynx/api-languageservice@^2.13.0` and forwards to it, so whatever is published there
continues to reach an existing install. That is how npm resolves ranges, not a support
commitment — there will be no further releases under the old name. Migrate to
`@speclynx/api-languageservice` to stay supported.
