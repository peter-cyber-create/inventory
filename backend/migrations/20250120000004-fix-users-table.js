'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if users table exists
    const usersExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!usersExists[0].exists) {
      console.log('⚠️  users table does not exist yet. Skipping this migration.');
      return;
    }

    // Check if facilities table exists (required for foreign key)
    const facilitiesExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'facilities');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!facilitiesExists[0].exists) {
      console.log('⚠️  facilities table does not exist yet. Skipping this migration.');
      return;
    }

    // Drop and recreate users table with correct structure
    await queryInterface.dropTable('users');
    
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      depart: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      facilityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'facilities',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create a test facility first
    await queryInterface.bulkInsert('facilities', [{
      id: 1,
      name: 'Test Facility',
      code: 'TF001',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], { ignoreDuplicates: true });

    // Create test users
    // ⚠️ SECURITY WARNING: Default password must be changed immediately after deployment
    // This is a temporary default password for initial setup only
    const bcrypt = require('bcrypt');
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'; // CHANGE THIS IN PRODUCTION
    const hashedPassword = await bcrypt.hash(defaultPassword, 12); // Increased rounds for security
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@moh.go.ug',
        password: hashedPassword,
        firstname: 'Admin',
        lastname: 'User',
        role: 'admin',
        facilityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'store_manager',
        email: 'store@moh.go.ug',
        password: hashedPassword,
        firstname: 'Store',
        lastname: 'Manager',
        role: 'store',
        facilityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'it_manager',
        email: 'it@moh.go.ug',
        password: hashedPassword,
        firstname: 'IT',
        lastname: 'Manager',
        role: 'it',
        facilityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'fleet_manager',
        email: 'fleet@moh.go.ug',
        password: hashedPassword,
        firstname: 'Fleet',
        lastname: 'Manager',
        role: 'garage',
        facilityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'finance_manager',
        email: 'finance@moh.go.ug',
        password: hashedPassword,
        firstname: 'Finance',
        lastname: 'Manager',
        role: 'finance',
        facilityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
