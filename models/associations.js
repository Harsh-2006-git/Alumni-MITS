import Event from "./event.js";
import EventRegistration from "./eventRegistration.js";

// MongoDB equivalent of "Event.hasMany(EventRegistration)"
// Each EventRegistration stores eventId: ObjectId of Event
// To populate: Event.find().populate("registrations")
Event.schema.virtual("registrations", {
  ref: "EventRegistration",
  localField: "_id",
  foreignField: "eventId",
});

// MongoDB equivalent of "EventRegistration.belongsTo(Event)"
// To populate: EventRegistration.find().populate("event")
EventRegistration.schema.virtual("event", {
  ref: "Event",
  localField: "eventId",
  foreignField: "_id",
  justOne: true,
});

// required for virtual fields in JSON
Event.set("toObject", { virtuals: true });
Event.set("toJSON", { virtuals: true });
EventRegistration.set("toObject", { virtuals: true });
EventRegistration.set("toJSON", { virtuals: true });

export { Event, EventRegistration };
