// models/Job.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Job = sequelize.define(
  "Job",
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
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "full-time",
        "part-time",
        "contract",
        "internship",
        "remote"
      ),
      defaultValue: "full-time",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    postedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    closedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userType: {
      type: DataTypes.ENUM("Alumni", "Company", "Admin"),
      defaultValue: "Alumni",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requiredSkills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    qualifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    companyWebsite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "closed", "draft"),
      defaultValue: "active",
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

export default Job;
