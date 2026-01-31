#!/usr/bin/env node

/**
 * Check for missing authorize imports in route files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const routesDir = path.join(__dirname, '../../backend/routes');

function findRouteFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findRouteFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const usesAuthorize = /authorize\s*\(/.test(content);
  const hasImport = /require\s*\([^)]*authorize|const\s+authorize\s*=/.test(content);
  
  if (usesAuthorize && !hasImport) {
    return {
      file: path.relative(routesDir, filePath),
      issue: 'Uses authorize but missing import'
    };
  }
  
  return null;
}

console.log('🔍 Checking for missing authorize imports...\n');

const routeFiles = findRouteFiles(routesDir);
const issues = [];

routeFiles.forEach(file => {
  const issue = checkFile(file);
  if (issue) {
    issues.push(issue);
  }
});

if (issues.length > 0) {
  console.log('❌ Found issues:\n');
  issues.forEach(issue => {
    console.log(`  - ${issue.file}: ${issue.issue}`);
  });
  process.exit(1);
} else {
  console.log('✅ All route files have proper authorize imports!');
  process.exit(0);
}
