"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("QuestionLogs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      standalone_question: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      history: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sparql_error: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      error: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("QuestionLogs");
  },
};
