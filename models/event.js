import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      maxlength: 100,
    },



    organizer: {
      type: String,
      required: true,
      maxlength: 100,
    },

    organizerEmail: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["alumni", "student", "admin"],
      default: "alumni",
    },

    isScheduled: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: [
        "trainig and mentorships",
        "tech",
        "cultural",
        "sports",
        "educational",
        "special",
      ],
      default: "special",
    },

    type: {
      type: String,
      enum: ["virtual", "in-person"],
      default: "in-person",
    },

    maxAttendees: {
      type: Number,
      default: 30,
    },

    image: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

EventSchema.virtual("registrations", {
  ref: "EventRegistration",
  localField: "_id",
  foreignField: "eventId",
});

EventSchema.set("toObject", { virtuals: true });
EventSchema.set("toJSON", { virtuals: true });

const Event = mongoose.model("Event", EventSchema);

export default Event;
