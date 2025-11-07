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
      type: DataTypes.ENUM("Alumni", "Company", "Admin", "Auto"),
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
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Source platform (internshala, remoteok, wellfound)",
    },
    sourceId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      comment: "Unique ID from source platform",
    },
    sourceUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "URL of the original job posting",
    },
    isAutoPosted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether job was automatically scraped",
    },
    applyLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Direct application link",
    },
    status: {
      type: DataTypes.ENUM("active", "closed", "expired", "expiring_soon"),
      defaultValue: "active",
    },
    lastChecked: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

export default Job;
