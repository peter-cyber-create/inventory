
const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "inventory_db",
  username: process.env.DB_USER || "root",
  password: String(process.env.DB_PASS || ""),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connection has been established successfully.");
    // await sequelize.sync({ force: true }); // Use force: true to drop & recreate tables
    // console.log("✅ All models synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

module.exports = { connectDB, sequelize, Sequelize, DataTypes, QueryTypes };
