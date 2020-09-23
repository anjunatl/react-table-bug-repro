#!/bin/sh
pushd ${BASH_SOURCE%/*}/.. && docker exec -it bug-demo npm run watch && popd