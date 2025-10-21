// models/associations.js
import Event from "./event.js";
import EventRegistration from "./eventRegistration.js";

// Event has many EventRegistrations
Event.hasMany(EventRegistration, {
  foreignKey: "eventId",
  as: "registrations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// EventRegistration belongs to Event
EventRegistration.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { Event, EventRegistration };
