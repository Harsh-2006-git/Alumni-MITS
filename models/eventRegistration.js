import mongoose from "mongoose";

const EventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
      },
    },

    userName: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["alumni", "student", "admin"],
      required: true,
    },
    userPhone: {
      type: String,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "event_registrations",
  }
);

// ✅ Virtual for event association
EventRegistrationSchema.virtual("event", {
  ref: "Event",
  localField: "eventId",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals in JSON output
EventRegistrationSchema.set("toJSON", { virtuals: true });

const EventRegistration = mongoose.model(
  "EventRegistration",
  EventRegistrationSchema
);

export default EventRegistration;
