#!/bin/sh
cd benchmarking &&
# Install dependencies on GitHub CI, should skip under act
if [ ! -d node_modules ] ; then CYPRESS_INSTALL_BINARY=0 npm ci ; fi &&
# Build so that src/node_modules exists and @sapper/… can be resolved
npx sapper build &&
# Static analysis
npm run lint &&
# Run unit tests and generate coverage data
npx c8 npm run unit &&
# Check coverage level meets criteria
npm run check-coverage &&
# Remove coverage artefacts, as under act they are owned by root
rm -r coverage
