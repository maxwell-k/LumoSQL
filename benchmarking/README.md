# Benchmarking

## Quick start

### Create the benchmarking data

1. Start with the root of this repository as the current working directory
2. Make sure you have successfully built the repository once e.g. with a simple
   `make` command
3. Set the `WORKDIR` environment variable to where you want to store the
   benchmarking data e.g. `export WORKDIR=~/data`
4. Start the benchmarking, the shell script below will produce five runs:

   ```sh
   test -d "$WORKDIR" || echo '$WORKDIR is not set properly'
   repo="$PWD"
   cd "$WORKDIR"
   date &&
   seq 1 5 | while read i ; do
     test -d "$i" || git clone "$repo" "$i" || break
     test -d "$i/src-SQLite" || git -C "$i" clone "$repo/src-SQLite" || break
     test -d "$i/src-lmdb" || git -C "$i" clone "$repo/src-lmdb" || break
     make -C "$i" benchmark || break
   done &&
   date
   ```

5. Add metadata such as a title to `metadata.json` in the data directory.

### Copy the data into this tree

```sh
test -d "$WORKDIR" || echo '$WORKDIR is not set properly'
make copy NAME=v9999
```

### Summarise and publish the benchmarking data

The steps below summarise and publish the benchmarking results on GitHub pages.
This process use Node JS and a JavaScript framework called svelte. To avoid
installing the dependencies

Then start with this directory, `benchmarking`, as the current directory:

```sh
export COLLECTION=production
make dev                                    # check everything looks OK
make export
make serve                                  # check again
export GITHUB_REPOSITORY=maxwell-k/LumoSQL  # to simulate GitHub CI
make publish
```

If you do not wish to use containers, make sure you have Node JS 12 or higher
installed, and the
[yarn package manage version 1](https://classic.yarnpkg.com/lang/en/).

## Terminology

1. Several runs and corresponding metadata make up a data **set**
2. A **run** includes separate reports on different versions, it can be
   represented as a directory
3. A **report** shows the results of different tests for a single version, it
   can be represented as an HTML file
4. This benchmarking compares different **versions** for example upstream SQLite
   3.7.17 is a version
5. Comparisons are made across different **tests**, tests typically have a name
   and a value

## Design choices

This benchmarking project:

- uses ES Modules where possible
- avoids a module bundler like "rollup" as much as possible for simplicity
- has 100% test coverage for `src/utils/`
- formats everything with https://prettier.io
- checks JavaScript and Svelte code with https://eslint.org

## Prerequisites

- Node JS >= 12, for ES Modules support

## Tests

The full test suite for the benchmarking code consists of:

1. Unit tests and
2. Integration tests

If all dependencies are installed, `yarn test` will run both the unit and
integration tests.

To run the test suite using `podman` or `docker` use:

```sh
cd benchmarking &&        # start in the directory that contains this README
make check                # or
make ENGINE=docker check  # can leave files owned by root
```

The full test suite is run as a workflow via GitHub actions using Linux
containers via `.github/workflows/benchmarking.yaml` which executes the check
target from `./Makefile`.

<details>

<summary>Versions</summary>

These instructions were most recently tested with:

```sh
$ node --version
v12.15.0
$ yarn --version
1.22.4
$ podman --version
podman version 1.6.1
```

</details>

### Unit tests

We use [Mocha](https://mochajs.org) for unit tests:

```sh
yarn run unit
yarn run unit inspect
```

Mocha's support for ES Modules is a
[unreleased](https://github.com/mochajs/mocha/pull/4038). The version of mocha
specified in `package.json` is an experimental release with support for ES
Modules.

### Integration tests

We use [Cypress](https://cypress.io) for integration tests.

Behind the scenes `.ci/check.sh`: builds the application with Sapper before
calling `src/integration-tests.js` which uses [start-server-and-test] to run a
server and the integration tests.

To make running the tests locally more similar to the CI environment use the
same container rather than installing Cypress. A Makefile target is provided as
a convenience:

```sh
make cypres-open                  # view tests in the Cypress GUI with podman
make ENGINE=docker cypress-open   # or docker
```

</details>

[the official instructions]:
  https://classic.yarnpkg.com/en/docs/install/#centos-stable
[start-server-and-test]: https://www.npmjs.com/package/start-server-and-test
