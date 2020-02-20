#!/bin/sh
cd benchmarking &&
# Install dependencies on GitHub CI, should skip under act
if [ ! -d node_modules ] ; then CYPRESS_INSTALL_BINARY=0 npm ci ; fi &&
# Build so that src/node_modules exists and @sapper/… can be resolved
npm run build &&
# Static analysis
npm run lint &&
# Run unit tests and generate coverage data
npm run coverage &&
# Check coverage level meets criteria
npm run coverage:check &&
# Remove coverage artefacts, as under act they are owned by root
rm -r coverage
