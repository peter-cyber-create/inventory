'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      firstname: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      phoneNo: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('type', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('category', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      typeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'type', key: 'id' } },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('brand', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('model', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      categoryId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'category', key: 'id' } },
      brandId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'brand', key: 'id' } },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('depart', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('division', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      deptId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'depart', key: 'id' } },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('staff', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING },
      phoneno: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING, allowNull: false },
      deptId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'depart', key: 'id' } },
      divisionId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'division', key: 'id' } },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('assets', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      description: { type: Sequelize.STRING, allowNull: false },
      serialNo: { type: Sequelize.STRING },
      engravedNo: { type: Sequelize.STRING },
      processor: { type: Sequelize.STRING },
      memory: { type: Sequelize.STRING },
      graphics: { type: Sequelize.STRING },
      storage: { type: Sequelize.STRING },
      orderNo: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assets');
    await queryInterface.dropTable('staff');
    await queryInterface.dropTable('division');
    await queryInterface.dropTable('depart');
    await queryInterface.dropTable('model');
    await queryInterface.dropTable('brand');
    await queryInterface.dropTable('category');
    await queryInterface.dropTable('type');
    await queryInterface.dropTable('users');
  }
};
