// models/Campaign.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Campaign = sequelize.define(
  "Campaign",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    campaignTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categories: {
      type: DataTypes.ENUM(
        "startup",
        "research",
        "innovation",
        "infrastructure",
        "scholarship",
        "community",
        "other"
      ),
      allowNull: false,
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    detailedDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      allowNull: false,
    },
    projectLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { is: /^[0-9+\-() ]+$/ },
    },
    userType: {
      type: DataTypes.ENUM("student", "alumni", "college", "admin"),
      defaultValue: "alumni",
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "campaigns",
    timestamps: true,
  }
);

export default Campaign;
