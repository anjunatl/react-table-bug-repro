#!/bin/sh
pushd ${BASH_SOURCE%/*}/.. && docker-compose up && popd