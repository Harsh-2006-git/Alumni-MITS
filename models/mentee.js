// models/MentorStudent.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Mentor from "./mentor.js";
import Student from "./user.js";

const MentorStudent = sequelize.define(
  "MentorStudent",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mentor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mentors",
        key: "id",
      },
    },
    student_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "completed", "cancelled"),
      defaultValue: "pending",
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    request_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    session_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    session_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    request_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mentor_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "mentor_students",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["mentor_id", "student_id"],
      },
    ],
  }
);

// Define associations
MentorStudent.belongsTo(Mentor, {
  foreignKey: "mentor_id",
  as: "mentor",
});

MentorStudent.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});

Mentor.hasMany(MentorStudent, {
  foreignKey: "mentor_id",
  as: "mentorshipRelations",
});

Student.hasMany(MentorStudent, {
  foreignKey: "student_id",
  as: "mentorshipRelations",
});

export default MentorStudent;
