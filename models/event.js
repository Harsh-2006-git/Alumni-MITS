// models/Event.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import EventRegistration from "./eventRegistration.js";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    organizer: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    organizerEmail: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: false,
    },
    userType: {
      type: DataTypes.ENUM("alumni", "student", "admin"),
      defaultValue: "alumni",
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.ENUM(
        "trainig and mentorships",
        "tech",
        "cultural",
        "sports",
        "educational",
        "special"
      ),
      allowNull: false,
      defaultValue: "special",
    },
    type: {
      type: DataTypes.ENUM("virtual", "in-person"),
      allowNull: false,
      defaultValue: "in-person",
    },
    maxAttendees: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 30,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "events",
    timestamps: false,
  }
);
import("./eventRegistration.js").then(({ default: EventRegistration }) => {
  Event.hasMany(EventRegistration, {
    foreignKey: "eventId",
    as: "registrations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
});

export default Event;
