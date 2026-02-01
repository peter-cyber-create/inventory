#!/usr/bin/env node

/**
 * Script to convert ES6 imports to CommonJS requires in backend files
 * This ensures compatibility when running with plain Node.js (PM2 default)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKEND_DIR = path.join(__dirname, '..', 'backend');

// Files that need conversion (ES6 import from db.js)
const filesToFix = [
  'models/assets/assetsModel.js',
  'models/vehicles/vServiceRequest.js',
  'models/jobCardSpare/JobCardSpare.js',
  'models/vehicles/vType.js',
  'models/vehicles/vMake.js',
  'models/vehicles/vGarage.js',
  'models/vehicles/vSpareQty.js',
  'models/vehicles/VehicleParts.js',
  'models/vehicles/vSpareCategory.js',
  'models/vehicles/vDrivers.js',
  'models/vehicles/vSpareParts.js',
  'models/vehicles/partRequests.js',
  'models/vehicles/vDisposalModel.js',
  'models/server/serverModel.js',
  'models/Logs/auditModel.js',
  'models/vehicles/vehicleModel.js',
  'models/vehicles/partsUsed.js',
  'models/vehicles/garageStore.js',
  'models/vehicles/jobCardModel.js',
  'models/vehicles/assignDriver.js',
  'models/vehicles/GarageReceive.js',
  'models/assets/DisposalModel.js',
  'models/assets/issueModel.js',
  'models/assets/dispatchModel.js',
  'models/assets/userDetails.js',
  'models/assets/goodsReceived.js',
  'models/assets/requisition.js',
  'models/assets/tranferModel.js',
  'models/assets/MaintenanceModel.js',
  'models/assets/ReceivedItems.js',
  'models/jobcards/jobCardModel.js',
  'routes/vehicles/jobCardRoutes.js',
  'routes/jobcard/jobCardRoutes.js',
  'routes/vehicles/vehicleRoutes.js',
  'routes/vehicles/vSpareQty.js',
  'routes/activity/reportRoutes.js',
  'routes/helpdesk/tickets/ticketRoutes.js',
];

let fixedCount = 0;
let errorCount = 0;

console.log('🔧 Converting ES6 imports to CommonJS requires...\n');

filesToFix.forEach(relativePath => {
  const filePath = path.join(BACKEND_DIR, relativePath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${relativePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Convert: import { sequelize, DataTypes } from '../../config/db.js';
    // To: const { sequelize, DataTypes } = require('../../config/db.js');
    const importPattern = /^import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"];?$/gm;
    content = content.replace(importPattern, (match, imports, modulePath) => {
      modified = true;
      return `const ${imports.trim()} = require('${modulePath}');`;
    });

    // Convert: import X from 'path';
    // To: const X = require('path');
    const defaultImportPattern = /^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?$/gm;
    content = content.replace(defaultImportPattern, (match, importName, modulePath) => {
      modified = true;
      return `const ${importName} = require('${modulePath}');`;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${relativePath}`);
      fixedCount++;
    } else {
      console.log(`ℹ️  No changes needed: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${relativePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✨ Conversion complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errorCount} files`);
