import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumni from "./alumni.js"; // Your existing Alumni model

const AlumniProfile = sequelize.define(
  "AlumniProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumniId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Alumni,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    location: { type: DataTypes.STRING, allowNull: true },
    branch: { type: DataTypes.STRING, allowNull: true },
    about: { type: DataTypes.TEXT, allowNull: true },
    skills: { type: DataTypes.JSON, allowNull: true }, // ["JavaScript", "Node.js"]
    achievements: { type: DataTypes.JSON, allowNull: true }, // ["Won Hackathon 2024", "Published Paper"]
    linkedin: { type: DataTypes.STRING, allowNull: true },
    github: { type: DataTypes.STRING, allowNull: true },
    twitter: { type: DataTypes.STRING, allowNull: true },
    portfolio: { type: DataTypes.STRING, allowNull: true },
    batch: {
      type: DataTypes.STRING,
      allowNull: true,
      // Example: "2024-2028"
    },

    // Multiple education entries
    education: {
      type: DataTypes.JSON,
      allowNull: true,
      // Example:
      // [
      //   { type: "Bachelor", stream: "CS", institution: "MIT", from: "2015-08-01", to: "2019-05-30", gpa: "9.2" },
      //   { type: "Master", stream: "AI", institution: "Stanford", from: "2020-08-01", to: "2022-05-30", gpa: "9.5" }
      // ]
    },

    // Multiple experience entries
    experience: {
      type: DataTypes.JSON,
      allowNull: true,
      // Example:
      // [
      //   { designation: "Software Engineer", company: "Google", from: "2020-01-01", to: "2022-06-30", current: false, location: "NY", description: "Worked on X" },
      //   { designation: "Senior Engineer", company: "Meta", from: "2022-07-01", to: null, current: true, location: "CA", description: "Leading Y project" }
      // ]
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
    tableName: "alumni_profiles",
    timestamps: true,
  }
);

// Associations
AlumniProfile.belongsTo(Alumni, { foreignKey: "alumniId", as: "alumni" });
Alumni.hasOne(AlumniProfile, { foreignKey: "alumniId", as: "profile" });

export default AlumniProfile;
