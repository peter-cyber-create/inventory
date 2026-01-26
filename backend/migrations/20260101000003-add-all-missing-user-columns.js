'use strict';

/**
 * Comprehensive migration to add ALL missing columns to users table
 * This ensures all columns from the UserModel are present in the database
 */
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

    // All columns that should exist based on UserModel
    const columnsToAdd = [
      {
        name: 'health_email',
        definition: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Official health mail (e.g., user@health.go.ug)'
        }
      },
      {
        name: 'phone',
        definition: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Contact phone number'
        }
      },
      {
        name: 'designation',
        definition: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Job title/designation (e.g., Senior Officer, Manager)'
        }
      },
      {
        name: 'module',
        definition: {
          type: Sequelize.STRING(50),
          allowNull: true,
          comment: 'User module assignment'
        }
      },
      {
        name: 'depart',
        definition: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'User department (legacy field)'
        }
      },
      {
        name: 'facilityid',
        definition: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'facilities',
            key: 'id'
          },
          comment: 'Reference to facilities table'
        }
      },
      {
        name: 'department_id',
        definition: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'departments',
            key: 'id'
          },
          comment: 'Reference to departments table'
        }
      },
      {
        name: 'is_active',
        definition: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          comment: 'Whether the user account is active'
        }
      }
    ];

    console.log('Checking and adding missing columns to users table...\n');

    for (const column of columnsToAdd) {
      const exists = await columnExists('users', column.name);
      if (!exists) {
        try {
          await queryInterface.addColumn('users', column.name, column.definition);
          console.log(`  ✅ Added column: ${column.name}`);
        } catch (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`  ⚠️  Column ${column.name} already exists, skipping`);
          } else {
            console.error(`  ❌ Error adding ${column.name}:`, error.message);
          }
        }
      } else {
        console.log(`  ✓ Column ${column.name} already exists`);
      }
    }

    console.log('\n✅ All columns checked and added!');
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

    const columnsToRemove = [
      'health_email',
      'phone',
      'designation',
      'module',
      'depart',
      'facilityid',
      'department_id',
      'is_active'
    ];

    for (const columnName of columnsToRemove) {
      if (await columnExists('users', columnName)) {
        try {
          await queryInterface.removeColumn('users', columnName);
          console.log(`  ✅ Removed column: ${columnName}`);
        } catch (error) {
          console.error(`  ❌ Error removing ${columnName}:`, error.message);
        }
      }
    }
  }
};













