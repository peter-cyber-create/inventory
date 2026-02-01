const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const path = require('path');
// Load environment variables from the correct location
require('dotenv').config({ path: path.join(__dirname, '../../config/environments/backend.env') });

// Validate required environment variables (non-blocking in production)
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`⚠️ Missing required database environment variables: ${missingVars.join(', ')}`);
  console.warn(`⚠️ Server will start but database operations will fail until configured.`);
  // Don't throw error - allow server to start even without DB config
  // This prevents 502 errors when DB config is missing
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Database Connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("❌ Unable to connect to the PostgreSQL database:", error.message);
    // In production, we might want to retry or exit
    if (process.env.NODE_ENV === 'production') {
      console.error("⚠️ Database connection failed in production. Server will continue but database operations may fail.");
    }
    return false;
  }
};

// Check database connection before operations
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { connectDB, checkConnection, sequelize, Sequelize, DataTypes, QueryTypes };
