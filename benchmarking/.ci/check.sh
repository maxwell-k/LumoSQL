#!/bin/sh
# Install dependencies where needed
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
# Install the cypress binary without too much output
CI=true yarn run cypress install &&
# Verify the install
yarn run cypress verify &&
# Start server, run integration tests, stop server
node src/integration-tests.js
