// models/EventRegistration.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Event from "./event.js";

const EventRegistration = sequelize.define(
  "EventRegistration",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
    userEmail: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("alumni", "student", "admin"),
      allowNull: false,
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "event_registrations",
    timestamps: true,
  }
);

import("./event.js").then(({ default: Event }) => {
  EventRegistration.belongsTo(Event, {
    foreignKey: "eventId",
    as: "event",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
});
export default EventRegistration;
