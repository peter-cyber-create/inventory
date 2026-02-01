#!/bin/bash
cd "$(dirname "$0")"
# Use the full path to node_modules babel-node
exec node_modules/.bin/babel-node index.js
