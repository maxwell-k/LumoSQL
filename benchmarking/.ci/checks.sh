#!/bin/sh
# Install dependencies on GitHub CI, should skip under `act -b`
if [ ! -d "$(npm bin)" ] ; then CYPRESS_INSTALL_BINARY=0 npm ci ; fi &&
# Build so that src/node_modules exists and @sapper/… can be resolved in lint
"$(npm bin)/sapper" build &&
# Static analysis
npm run lint &&
# Run unit tests and generate coverage data
"$(npm bin)/c8" npm run unit &&
# Check coverage level meets criteria
npm run check-coverage &&
# Cache the cypress binary where act makes it available
export CYPRESS_CACHE_FOLDER="${PWD}/.ci/cypress_cache" &&
# Install the cypress binary without too much output
CI=true "$(npm bin)/cypress" install &&
# Verify the install
"$(npm bin)/cypress" verify &&
# Start server and run integration tests
npm run integration-tests &&
# Garbage collect the npm cache
npm cache verify
