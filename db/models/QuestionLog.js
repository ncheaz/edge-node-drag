// models/QuestionLog.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const QuestionLog = sequelize.define(
  "QuestionLog",
  {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    standalone_question: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    history: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sparql_error: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    error: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "QuestionLogs",
    timestamps: true,
  }
);

export const createQuestionLog = async (data) => {
  try {
    const log = await QuestionLog.create({
      question: data.question,
      standalone_question: data.standaloneQuestion,
      answer: data.answer,
      history: data.history,
      sparql_error: data.sparqlError,
      error: data.error,
    });
    return log;
  } catch (error) {
    console.error("Error creating QuestionLog:", error);
    throw new Error("Could not create QuestionLog");
  }
};

export default QuestionLog;
