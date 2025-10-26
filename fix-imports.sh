#!/bin/bash

echo "🔧 Fixing ES6 imports to CommonJS..."

# Find all .js files with ES6 imports and fix them
find backend -name "*.js" -type f -exec grep -l "^import.*from" {} \; | while read file; do
    echo "Fixing: $file"
    
    # Replace import statements
    sed -i 's/^import \([^}]*\) from \([^;]*\);$/const \1 = require(\2);/g' "$file"
    sed -i 's/^import \([^{}]*\) from \([^;]*\);$/const \1 = require(\2);/g' "$file"
    
    # Replace export default
    sed -i 's/^export default \([^;]*\);$/module.exports = \1;/g' "$file"
    
    # Replace export { ... }
    sed -i 's/^export { \([^}]*\) };$/module.exports = { \1 };/g' "$file"
    
    # Replace export const/let/var
    sed -i 's/^export const /const /g' "$file"
    sed -i 's/^export let /let /g' "$file"
    sed -i 's/^export var /var /g' "$file"
    
    # Add module.exports at the end if there are exports but no module.exports
    if grep -q "^export " "$file" && ! grep -q "module.exports" "$file"; then
        echo "module.exports = {};" >> "$file"
    fi
done

echo "✅ Import fixes completed!"
