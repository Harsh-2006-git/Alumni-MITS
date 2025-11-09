// models/Mentor.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumni from "./alumni.js";
import Student from "./user.js";

const Mentor = sequelize.define(
  "Mentor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumni_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Alumni,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { is: /^[0-9+\-() ]+$/ },
    },
    batch_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    current_position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    expertise: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    topics: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    mentee_students: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of student IDs who are mentees under this mentor",
    },
  },
  {
    tableName: "mentors",
    timestamps: true,
  }
);

// Define associations
Mentor.belongsTo(Alumni, {
  foreignKey: "alumni_id",
  as: "alumni",
});

Alumni.hasOne(Mentor, {
  foreignKey: "alumni_id",
  as: "mentor",
});

// Many-to-Many relationship between Mentor and Student
Mentor.belongsToMany(Student, {
  through: "MentorStudent",
  as: "mentees",
  foreignKey: "mentor_id",
  otherKey: "student_id",
});

Student.belongsToMany(Mentor, {
  through: "MentorStudent",
  as: "mentors",
  foreignKey: "student_id",
  otherKey: "mentor_id",
});

export default Mentor;
