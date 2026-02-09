'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if servers table already exists
    const tableExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'servers');",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (tableExists[0].exists) {
      console.log('⚠️  servers table already exists');
      return;
    }

    // Create servers table
    await queryInterface.createTable('servers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      serialNo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      engranvedNo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      serverName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productNo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      IP: {
        type: Sequelize.STRING,
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      memory: {
        type: Sequelize.STRING,
        allowNull: false
      },
      purchaseDate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      processor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expiryDate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hypervisor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hardDisk: {
        type: Sequelize.STRING,
        allowNull: false
      },
      warranty: {
        type: Sequelize.STRING,
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

    console.log('✅ Created servers table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('servers');
  }
};
