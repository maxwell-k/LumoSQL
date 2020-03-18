#!/bin/sh
# Install dependencies on GitHub CI, should skip under `act -b`
if [ ! -d "$(yarn bin)" ] ; then
	CYPRESS_INSTALL_BINARY=0 yarn install --frozen-lockfile
fi &&
# Build so that src/node_modules exists and @sapper/… can be resolved in lint
yarn run sapper build &&
# Static analysis
yarn run lint &&
# Run unit tests and generate coverage data
yarn run c8 yarn run unit &&
# Check coverage level meets criteria
yarn run check-coverage &&
# Cache the cypress binary where act makes it available
export CYPRESS_CACHE_FOLDER="${PWD}/.ci/cypress_cache" &&
# Install the cypress binary without too much output
CI=true yarn run cypress install &&
# Verify the install
yarn run cypress verify &&
# Start server and run integration tests
yarn run integration-tests
