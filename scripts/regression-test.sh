#!/bin/bash
# Copyright (c) 2024 Discover Financial Services
set -e

echo "Setting test tool environment variables"

export TEST_TOOL=jest

export no_proxy=localhost,discoverfinancial.com
export http_proxy=http://proxy.discoverfinancial.com:8080
export https_proxy=http://proxy.discoverfinancial.com:8080
export NO_PROXY=$no_proxy
export HTTP_PROXY=$http_proxy
export HTTPS_PROXY=$https_proxy

echo "The base url is: ${APP_BASE_URL}"

SCRIPT_DIR=$(dirname "$0")

cd $SCRIPT_DIR/..

echo "Installing dependencies for regression test from directory `pwd`"

npm install

echo "Contents of node_modules: `ls node_modules`"

export CI=true

echo "Running the regression test"

npm run test

echo "Finished the regression test"

# Creation of the following directory tells trident that the test completed successfully
mkdir -p build/test-results/regressionTest
