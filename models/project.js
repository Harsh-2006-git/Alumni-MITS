// models/Project.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    detailedDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    techStack: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lookingForContributors: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    contributorsNeeded: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    roles: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    repoLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guidelines: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  }
);

export default Project;
