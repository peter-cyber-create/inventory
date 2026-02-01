#!/bin/bash
cd "$(dirname "$0")"
# Try babel-node first, fallback to plain node (since we converted all ES6 to CommonJS)
if [ -f "node_modules/.bin/babel-node" ]; then
    exec node_modules/.bin/babel-node index.js
elif command -v babel-node >/dev/null 2>&1; then
    exec babel-node index.js
else
    # Use plain node since all ES6 imports are converted to CommonJS
    exec node index.js
fi
