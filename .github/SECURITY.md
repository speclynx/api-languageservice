# Security Policy

If you believe you've found an exploitable security issue in the SpecLynx API Language
Service,
**please don't create a public issue**.

## Reporting a vulnerability

To report a vulnerability please send an email with the details to [info@speclynx.com](mailto:info@speclynx.com).

We'll acknowledge receipt of your report ASAP, and set expectations on how we plan to handle it.

## Supported versions

Security fixes are made to the latest release of `@speclynx/api-languageservice`.

`@speclynx/apidom-ls`, the name this package was published under up to 2.12.0, receives
security fixes and nothing else until 2027-03-21. It is a compatibility release depending
on `@speclynx/api-languageservice@^2.13.0`, so a fix published there reaches it through
that range without a release of its own.
