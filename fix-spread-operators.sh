#!/bin/bash

# Script to fix spread operator syntax for Babel compatibility
echo "Fixing spread operator syntax in backend files..."

# Find all JavaScript files in backend directory
find /home/peter/Desktop/Dev/inventory/backend -name "*.js" -type f | while read file; do
    # Check if file contains spread operators
    if grep -q "\.\.\." "$file"; then
        echo "Processing: $file"
        
        # Create backup
        cp "$file" "$file.bak"
        
        # Replace spread operators in object literals
        sed -i 's/{ \.\.\.\([^}]*\) }/Object.assign({}, \1)/g' "$file"
        sed -i 's/{\.\.\.\([^}]*\)}/Object.assign({}, \1)/g' "$file"
        
        # Replace spread operators in function parameters (more complex)
        # This is a basic replacement - may need manual review for complex cases
        sed -i 's/\.\.\.\([a-zA-Z_][a-zA-Z0-9_]*\)/arguments/g' "$file"
        
        echo "Fixed: $file"
    fi
done

echo "Spread operator fixes completed!"
echo "Note: Some files may need manual review for complex cases."

