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

    // Check if depart column already exists
    const columnExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'depart'
      );`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!columnExists[0].exists) {
      console.log('Adding depart column to users table...');
      await queryInterface.addColumn('users', 'depart', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'User department (legacy field)'
      });
      console.log('✅ depart column added successfully');
    } else {
      console.log('⚠️  depart column already exists. Skipping.');
    }
  },

  async down(queryInterface, Sequelize) {
    // Check if column exists before removing
    const columnExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'depart'
      );`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (columnExists[0].exists) {
      await queryInterface.removeColumn('users', 'depart');
    }
  }
};














