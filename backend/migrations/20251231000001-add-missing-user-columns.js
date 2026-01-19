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

    // Helper function to check if column exists
    const columnExists = async (tableName, columnName) => {
      const result = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}' 
          AND column_name = '${columnName}'
        );`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      return result[0].exists;
    };

    // Add missing columns to users table that are in the model but not in the database
    if (!(await columnExists('users', 'health_email'))) {
      await queryInterface.addColumn('users', 'health_email', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Official health mail (e.g., user@health.go.ug)'
      });
    }

    if (!(await columnExists('users', 'phone'))) {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Contact phone number'
      });
    }

    if (!(await columnExists('users', 'designation'))) {
      await queryInterface.addColumn('users', 'designation', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Job title/designation (e.g., Senior Officer, Manager)'
      });
    }

    if (!(await columnExists('users', 'module'))) {
      await queryInterface.addColumn('users', 'module', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'User module assignment'
      });
    }

    if (!(await columnExists('users', 'depart'))) {
      await queryInterface.addColumn('users', 'depart', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'User department (legacy field)'
      });
    }

    if (!(await columnExists('users', 'facilityid'))) {
      await queryInterface.addColumn('users', 'facilityid', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'facilities',
          key: 'id'
        },
        comment: 'Reference to facilities table'
      });
    }

    if (!(await columnExists('users', 'department_id'))) {
      await queryInterface.addColumn('users', 'department_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'departments',
          key: 'id'
        },
        comment: 'Reference to departments table'
      });
    }

    if (!(await columnExists('users', 'is_active'))) {
      await queryInterface.addColumn('users', 'is_active', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: 'Whether the user account is active'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Helper function to check if column exists before removing
    const columnExists = async (tableName, columnName) => {
      const result = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}' 
          AND column_name = '${columnName}'
        );`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      return result[0].exists;
    };

    if (await columnExists('users', 'health_email')) {
      await queryInterface.removeColumn('users', 'health_email');
    }
    if (await columnExists('users', 'phone')) {
      await queryInterface.removeColumn('users', 'phone');
    }
    if (await columnExists('users', 'designation')) {
      await queryInterface.removeColumn('users', 'designation');
    }
    if (await columnExists('users', 'module')) {
      await queryInterface.removeColumn('users', 'module');
    }
    if (await columnExists('users', 'depart')) {
      await queryInterface.removeColumn('users', 'depart');
    }
    if (await columnExists('users', 'facilityid')) {
      await queryInterface.removeColumn('users', 'facilityid');
    }
    if (await columnExists('users', 'department_id')) {
      await queryInterface.removeColumn('users', 'department_id');
    }
    if (await columnExists('users', 'is_active')) {
      await queryInterface.removeColumn('users', 'is_active');
    }
  }
};







