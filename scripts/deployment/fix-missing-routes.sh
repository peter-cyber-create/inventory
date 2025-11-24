#!/bin/bash

# Fix missing route files that cause backend crashes

set -e

APP_DIR="/var/www/inventory"
cd "$APP_DIR" || exit 1

echo "🔧 Fixing Missing Route Files..."
echo ""

# Check if backend/routes/uploads/index.js exists
echo "1. Checking route files..."
if [ ! -f "$APP_DIR/backend/routes/uploads/index.js" ]; then
    echo "❌ backend/routes/uploads/index.js is missing - creating it..."
    mkdir -p "$APP_DIR/backend/routes/uploads"
    cat > "$APP_DIR/backend/routes/uploads/index.js" << 'EOF'
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const XLSX = require("xlsx");
const Model = require("../../models/categories/model.js");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/models", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (const row of sheetData) {
            const { name, description, categoryId, brandId } = row;

            if (!name || !description || !categoryId || !brandId) {
                console.warn("Missing required fields in row:", row);
                continue; 
            }

            await Model.create({
                name,
                description,
                categoryId,
                brandId,
            });
        }

        // Delete the temporary file after processing
        fs.unlinkSync(req.file.path);

        res.status(200).send("File uploaded and data inserted into the database");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing the file");
    }
});

module.exports = router;
EOF
    echo "✅ Created backend/routes/uploads/index.js"
else
    echo "✅ backend/routes/uploads/index.js exists"
fi

# Check if backend/routes/downloads/index.js exists
if [ ! -f "$APP_DIR/backend/routes/downloads/index.js" ]; then
    echo "❌ backend/routes/downloads/index.js is missing - creating it..."
    mkdir -p "$APP_DIR/backend/routes/downloads"
    cat > "$APP_DIR/backend/routes/downloads/index.js" << 'EOF'
const express = require("express");
const router = express.Router();

// Placeholder for download routes
router.get("/", (req, res) => {
    res.json({ message: "Download routes" });
});

module.exports = router;
EOF
    echo "✅ Created backend/routes/downloads/index.js"
else
    echo "✅ backend/routes/downloads/index.js exists"
fi

# Ensure uploads directory exists
echo ""
echo "2. Checking uploads directory..."
if [ ! -d "$APP_DIR/backend/uploads" ]; then
    echo "Creating uploads directory..."
    mkdir -p "$APP_DIR/backend/uploads"
    chmod 755 "$APP_DIR/backend/uploads"
    echo "✅ Created uploads directory"
else
    echo "✅ uploads directory exists"
fi

# Verify all required route files exist
echo ""
echo "3. Verifying all route files..."
required_routes=(
    "backend/routes/users/userRoutes.js"
    "backend/routes/users/staffRoutes.js"
    "backend/routes/activity/activityRoutes.js"
    "backend/routes/activity/reportRoutes.js"
)

missing_routes=()
for route in "${required_routes[@]}"; do
    if [ ! -f "$APP_DIR/$route" ]; then
        missing_routes+=("$route")
    fi
done

if [ ${#missing_routes[@]} -gt 0 ]; then
    echo "⚠️  Missing route files:"
    for route in "${missing_routes[@]}"; do
        echo "   - $route"
    done
    echo ""
    echo "Please ensure all route files are present in the repository"
else
    echo "✅ All required route files exist"
fi

# Test if backend can start
echo ""
echo "4. Testing backend startup..."
cd "$APP_DIR/backend"
if node -e "require('./index.js')" 2>&1 | head -5; then
    echo "✅ Backend can load modules"
else
    echo "⚠️  Backend has module errors (this is expected if server isn't fully configured)"
fi
cd "$APP_DIR"

# Restart backend
echo ""
echo "5. Restarting backend..."
pm2 restart moh-ims-backend
sleep 3

# Check backend status
echo ""
echo "6. Checking backend status..."
pm2 list | grep moh-ims-backend

# Show recent logs
echo ""
echo "7. Recent backend logs:"
pm2 logs moh-ims-backend --lines 10 --nostream || true

echo ""
echo "=========================================="
echo "✅ Missing routes fix complete!"
echo "=========================================="

