// models/Alumni.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Alumni = sequelize.define(
  "Alumni",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      //unique: true,
      validate: { is: /^[0-9+\-() ]+$/ },
    },
    branch: { type: DataTypes.STRING, allowNull: true },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userType: {
      type: DataTypes.ENUM("student", "alumni"),
      defaultValue: "alumni",
      allowNull: false,
    },
    // models/Student.js
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
    tableName: "alumni",
    timestamps: true,
  }
);

export default Alumni;
