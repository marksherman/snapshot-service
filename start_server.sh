#!/bin/bash
# This script starts the service in "server mode" - handled by 'forever'
# Before this will work, do `node install forever -g`

forever start /home/ubuntu/snapshot-service/server/snapshot-service.js

