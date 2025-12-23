import Event from "./event.js";
import EventRegistration from "./eventRegistration.js";
import User from "./user.js";
import UserProfile from "./UserProfile.js";

// Event associations
Event.schema.virtual("registrations", {
  ref: "EventRegistration",
  localField: "_id",
  foreignField: "eventId",
});

EventRegistration.schema.virtual("event", {
  ref: "Event",
  localField: "eventId",
  foreignField: "_id",
  justOne: true,
});

// User associations
User.schema.virtual("profile", {
  ref: "UserProfile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// Settings for virtuals
Event.set("toObject", { virtuals: true });
Event.set("toJSON", { virtuals: true });
EventRegistration.set("toObject", { virtuals: true });
EventRegistration.set("toJSON", { virtuals: true });
User.set("toObject", { virtuals: true });
User.set("toJSON", { virtuals: true });
UserProfile.set("toObject", { virtuals: true });
UserProfile.set("toJSON", { virtuals: true });

export { Event, EventRegistration, User, UserProfile };
