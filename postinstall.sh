#!/usr/bin/env bash

git submodule init
git submodule update

cd client/lib/castify-api-docs
bower install
