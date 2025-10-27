'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
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
