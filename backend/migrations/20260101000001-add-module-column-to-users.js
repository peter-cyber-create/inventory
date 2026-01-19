'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if users table exists
    const tableExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!tableExists[0].exists) {
      console.log('⚠️  users table does not exist yet. Skipping this migration.');
      return;
    }

    // Check if module column already exists
    const columnExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'module'
      );`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!columnExists[0].exists) {
      console.log('Adding module column to users table...');
      await queryInterface.addColumn('users', 'module', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'User module assignment'
      });
      console.log('✅ module column added successfully');
    } else {
      console.log('⚠️  module column already exists. Skipping.');
    }
  },

  async down(queryInterface, Sequelize) {
    // Check if column exists before removing
    const columnExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'module'
      );`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (columnExists[0].exists) {
      await queryInterface.removeColumn('users', 'module');
    }
  }
};

