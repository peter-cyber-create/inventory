#!/bin/bash
cd "$(dirname "$0")"
exec npx babel-node index.js
