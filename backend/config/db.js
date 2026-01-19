const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const path = require('path');
// Load environment variables from the correct location
require('dotenv').config({ path: path.join(__dirname, '../../config/environments/backend.env') });

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingVars.join(', ')}. ` +
    `Please set these in your .env file.`
  );
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
  } catch (error) {
    console.error("Unable to connect to the PostgreSQL database:", error.message);
  }
};

module.exports = { connectDB, sequelize, Sequelize, DataTypes, QueryTypes };
