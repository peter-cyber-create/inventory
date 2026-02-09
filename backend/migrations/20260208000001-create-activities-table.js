'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if activities table already exists
    const tableExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activities');",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (tableExists[0].exists) {
      console.log('⚠️  activities table already exists');
      return;
    }

    // Create activities table
    await queryInterface.createTable('activities', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      activityName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      requested_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dept: {
        type: Sequelize.STRING,
        allowNull: true
      },
      funder: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending_accountability'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      invoiceDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      amt: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      reportPath: {
        type: Sequelize.STRING,
        allowNull: true
      },
      closedDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      vocherno: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    console.log('✅ Created activities table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('activities');
  }
};
