// models/studentProfile.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Student from "./user.js";

const StudentProfile = sequelize.define(
  "StudentProfile",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER.UNSIGNED, // ✅ Match Student.id type
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    location: { type: DataTypes.STRING, allowNull: true },
    branch: { type: DataTypes.STRING, allowNull: true },
    about: { type: DataTypes.TEXT, allowNull: true },
    skills: { type: DataTypes.JSON, allowNull: true },
    achievements: { type: DataTypes.JSON, allowNull: true },
    linkedin: { type: DataTypes.STRING, allowNull: true },
    github: { type: DataTypes.STRING, allowNull: true },
    twitter: { type: DataTypes.STRING, allowNull: true },
    portfolio: { type: DataTypes.STRING, allowNull: true },
    education: { type: DataTypes.JSON, allowNull: true },
    profilePhoto: { type: DataTypes.STRING, allowNull: true },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.JSON,
      allowNull: true,
      // Example:
      // [
      //   { designation: "Software Engineer", company: "Google", from: "2020-01-01", to: "2022-06-30", current: false, location: "NY", description: "Worked on X" },
      //   { designation: "Senior Engineer", company: "Meta", from: "2022-07-01", to: null, current: true, location: "CA", description: "Leading Y project" }
      // ]
    },
  },
  {
    tableName: "student_profiles",
    timestamps: true,
  }
);

// Associations
StudentProfile.belongsTo(Student, { foreignKey: "studentId", as: "student" });
Student.hasOne(StudentProfile, { foreignKey: "studentId", as: "profile" });

export default StudentProfile;
