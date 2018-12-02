'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING,
      },
      hash: {
        type: 'VARCHAR(2000)'
      },
      salt: {
        type: Sequelize.STRING
      },
      fb_id: {
        type: Sequelize.STRING
      },
      li_id: {
        type: Sequelize.STRING
      },
      google_id: {
        type: Sequelize.STRING
      },
      social_login: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      mls_number: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};