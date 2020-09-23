#!/bin/sh
pushd ${BASH_SOURCE%/*}/.. && docker exec -it bug-demo lnav /bug-demo/storage/logs && popd