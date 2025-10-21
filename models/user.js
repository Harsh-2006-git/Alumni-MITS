// models/Student.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      //unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      //unique: true,
      validate: { is: /^[0-9]{10,15}$/ },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("student", "alumni"),
      defaultValue: "student",
      allowNull: false,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["phone"] },
    ],
  }
);

export default Student;
