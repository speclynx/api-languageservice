[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2015 refractproject)
[comment]: <> (SPDX-License-Identifier: MIT)

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2015 Apiary Inc.)
[comment]: <> (SPDX-License-Identifier: MIT)

# SpecLynx ApiDOM Internal

[![Build Status](https://github.com/speclynx/apidom-internal/actions/workflows/build.yml/badge.svg)](https://github.com/speclynx/apidom-internal/actions)
[![Dependabot enabled](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically)

<div align="center">
    <a href="https://speclynx.com"><img width="636" height="407" alt="image" src="https://github.com/user-attachments/assets/1cfd6c8e-0206-4d53-9a2c-e4d10be84ca0" /></a>
</div>

The purpose of ApiDOM is to provide a single, unifying structure for describing APIs across
API description language and serialization formats. There currently exists several API description languages one can choose
when defining an API, from OpenAPI, RAML, API Blueprint or others.
There are also many serialization formats such as XML, YAML or JSON. Without a way to parse these formats
to the same structure, developers are required to handle each format one-by-one, each in a different
way and each translating to their internal domain model. This is tedious, time-consuming,
and requires each maintainer to stay in step with every format they support.

ApiDOM solves this complex problem in a simple way. It allows parsers to parse to a single structure
and allows tool builders to consume one structure for all formats.

To learn more about SpecLynx ApiDOM, visit https://github.com/speclynx/apidom/tree/main?tab=readme-ov-file#speclynx-apidom.

## Table of Contents

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development](#development)
  - [Setting up](#setting-up)
  - [npm scripts](#npm-scripts)
  - [Build artifacts](#build-artifacts)
  - [Using this monorepo as a local dev dependency](#using-this-monorepo-as-a-local-dev-dependency)
- [License](#license)
- [Software Bill Of Materials (SBOM)](#software-bill-of-materials-sbom)

## Getting started

### Installation

ApiDOM npm packages are installable and works with `Node.js >=16.14.2 <=24`.

You can install ApiDOM packages using [npm CLI](https://docs.npmjs.com/cli):

```sh
 $ npm install @speclynx/apidom-ls
```

### Usage

Every package of the monorepo has an associated README file demonstrating its purpose and containing
usage examples.

## Development

This is a monorepo for all ApiDOM packages. All the code is written in [TypeScript](https://www.typescriptlang.org/).
All the information necessary for working with monorepo can be found in this [article](https://vladimirgorej.com/blog/things-i-have-learned-maintaining-javascript-monorepo-with-lerna/).

[Node.js](https://nodejs.org/) `>=26.3.1` and `npm >=11.16.0`
are the minimum required versions that this repo runs on, but we recommend using the latest version of Node.js@26.

### Setting up

Run the following commands to setup the repository for local development:

```shell
 $ git clone https://github.com/speclynx/apidom-internal.git
 $ cd apidom-internal
 $ npm i
 $ npm run build
```

### npm scripts

Some npm scripts run in parallel. Default maximum parallelization is set `2`. This is due to the fact
that our `CI` runs on GitHub Actions which uses GitHub hosted runners with [2-core CPUs](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources).
If you have computer with more than 2 CPU cores, you can speed running npm scripts by
creating an environment variable called `CPU_CORES` and assign it a number of your CPU cores.

Assuming 4 CPU cores are available:

```sh
  $ export CPU_CORES=4
  $ npm run build
```

`build` scripts now runs much faster than before.

**Build artifacts**

```sh
 $ npm run build
```

**Test**

You must first **build the artifacts** before running tests.

```sh
 $ npm run test
```

**Lint**

```sh
 $ npm run lint
```

**Check TypeScript types**

```sh
 $ npm run typescript:check-types
```

**Generate TypeScript types**

```sh
 $ npm run typescript:declaration
```

**Clean**

```sh
 $ npm run clean
```

### Build artifacts

All the packages have identical build system and expose build artifacts in identical way.
After building artifacts, every package will contain five (5) additional directories.
All the build artifacts are polymorphic - they can run in different environments like [Web Browser](https://en.wikipedia.org/wiki/Web_browser), [Node.js](https://nodejs.org/) or [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

***.cjs**

These files are generated inside `src/` directory.
Contain ES5 compatible code with [CommonJS](https://en.wikipedia.org/wiki/CommonJS) style imports.
These build fragments are ideal for legacy [Node.js](https://nodejs.org/) and similar environments.

***.mjs**

These files are generated inside `src/` directory.
Contain ES5 compatible code with [ES6 imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
These build fragments are ideal for modern [Node.js](https://nodejs.org/),
bundling with [Webpack](https://webpack.js.org/) or similar bundlers.

**dist/**

This directory contains bundled build fragments that use [UMD](https://github.com/umdjs/umd) modules.
They're ideal for browser usage. The fragments are both in minified and un-minified form.

**types/**

TypeScript types generated from the source code.

### Using this monorepo as a local dev dependency

For using this monorepo as a local dev dependency for `dependent project`,
following commands needs to be issued inside the monorepo directory after
it has been cloned to a local filesystem:

```sh
 $ npm i
 $ npm run build
 $ npm run link
```
This will install the dependencies, built the monorepo and link all it's packages to
global `node_modules`.

#### Usage in `dependent project`

Now that we have monorepo packages globally linked we can use them in `dependent project`.
Let's say `dependent project` needs to directly use following packages:

- @speclynx/apidom-ls

Issuing following command from inside the `dependent project` will link these packages:

```sh
 $ npm link @speclynx/apidom-ls
```

If more packages (or all of them) need to be used in `dependent project`, they need to be explicitly
enumerated using above command and separated by single empty space.

Notice that we link packages using single `npm link` command. This is necessary
because of how `npm link` works internally. Always use single `npm link` command with
multiple package names as argument.

**Don't ever do this!**

```sh
 $ npm link @speclynx/apidom-ls
```

> Setting up npm script in `dependent project` can help keep things DRY.

#### Cleaning up

##### Dependent project

The best way to unlink monorepo packages from `dependent project` is to run following command
inside the `dependent project`:

```shell
 $ npm i
```

Running `npm i` will remove the links to monorepo packages and install the packages from npm registry.

> Note: running `npm unlink <package-name>` in `dependent project` will remove the link to monorepo package,
but will leave the `dependent project` node_modules in corrupted state as there is no version of the package
installed anymore. Running `npm i` is always a prefered way to restore your node_modules to original state.


##### ApiDOM Internal monorepo

It is not necessary to unlink monorepo packages from global `node_modules`. But if you
want to keep your global `node_modules` tidy you can run the following command in monorepo directory:

```shell
 $ npm run unlink
```

Running above npm script will unlink all monorepo packages from global `node_modules`.

If you want to just unlink particular monorepo packages, you have to enumerate them explicitly:

```shell
 $ npm unlink --global @speclynx/apidom-ls
```

## License

ApiDOM is licensed under [Apache 2.0 license](https://github.com/speclynx/apidom-internal/blob/main/LICENSES/Apache-2.0.txt).
ApiDOM comes with an explicit [NOTICE](https://github.com/speclynx/apidom-internal/blob/main/NOTICE) file
containing additional legal notices and information.

This project uses [REUSE specification](https://reuse.software/spec/) that defines a standardized method
for declaring copyright and licensing for software projects.

## Software Bill Of Materials (SBOM)

Software Bill Of materials is available in this repository [dependency graph](https://github.com/speclynx/apidom-internal/network/dependencies).
Click on `Export SBOM` button to download the SBOM in [SPDX format](https://spdx.dev/).

