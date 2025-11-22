import Event from "../models/event.js";
import EventRegistration from "../models/eventRegistration.js";
import mongoose from "mongoose";

export const addEvent = async (req, res) => {
  try {
    const { email, userType } = req.user;
    const IsCollege = req.user.userType === "admin";
    if (!email) {
      return res
        .status(400)
        .json({ message: "Organizer email not found in token" });
    }

    // ✅ Extract event details from request body
    const {
      title,
      description,
      date,
      location,
      price,
      organizer,
      category,
      type,
      maxAttendees,
      image,
    } = req.body;

    // ✅ Create new event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      organizer,
      organizerEmail: email, // from token
      category,
      type,
      maxAttendees,
      isScheduled: IsCollege, // true if admin, false otherwise
      image,
      userType,
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error adding event:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.user;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    const event = await Event.findById(id);

    // Find all registrations for this event
    const eventRegistrations = await EventRegistration.find({
      eventId: id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user owns the event
    if (event.organizerEmail !== email && event.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own events",
      });
    }

    // Delete all registrations for this event
    if (eventRegistrations.length > 0) {
      await EventRegistration.deleteMany({
        eventId: id,
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};

// Get all events (including past events)
export const getallEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 }); // Sort by date

    if (!events || events.length === 0) {
      return res.status(200).json({ message: "No events found" });
    }

    return res.status(200).json({
      message: "Events fetched successfully",
      count: events.length,
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Get today as YYYY-MM-DD string

    const upcomingEvents = await Event.find({
      isScheduled: true,
      date: {
        $gte: today, // Events from today onwards
      },
    }).sort({ date: 1 }); // Sort by nearest date first

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res
        .status(200)
        .json({ message: "No upcoming scheduled events found" });
    }

    return res.status(200).json({
      message: "Upcoming scheduled events fetched successfully",
      count: upcomingEvents.length,
      events: upcomingEvents,
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getmyevents = async (req, res) => {
  try {
    const { email, userType } = req.user;

    const myEvents = await Event.find({
      organizerEmail: email,
      userType: userType,
    }).sort({ date: 1 }); // Sort by date

    if (!myEvents || myEvents.length === 0) {
      return res.status(200).json({ message: "No events found" });
    }

    return res.status(200).json({
      message: "Your events fetched successfully",
      count: myEvents.length,
      events: myEvents,
    });
  } catch (error) {
    console.error("Error fetching your events:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Accept or Reject Event by Admin
export const reviewEvent = async (req, res) => {
  try {
    const userType = req.user.userType; // from JWT middleware
    if (userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { eventId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID format",
      });
    }

    // ✅ Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (action === "accept") {
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { isScheduled: true },
        { new: true }
      );

      return res.status(200).json({
        message: "Event accepted successfully",
        event: updatedEvent,
      });
    } else if (action === "reject") {
      // Delete all registrations for this event first
      await EventRegistration.deleteMany({ eventId: eventId });

      // Then delete the event
      await Event.findByIdAndDelete(eventId);

      return res.status(200).json({
        message: "Event rejected and deleted successfully",
      });
    } else {
      return res.status(400).json({
        message: "Invalid action. Use 'accept' or 'reject'.",
      });
    }
  } catch (error) {
    console.error("Error reviewing event:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update event by ID
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.user;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    // All available fields from req.body
    const {
      title,
      description,
      date,
      location,
      price,
      organizer,
      organizerEmail,
      postedBy,
      category,
      type,
      maxAttendees,
      image,
    } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user owns the event
    if (event.organizerEmail !== email && event.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own event",
      });
    }

    // Update event with all fields
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        location,
        price,
        organizer,
        organizerEmail,
        postedBy,
        category,
        type,
        maxAttendees,
        image,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

import EmailService from "../services/EmailService.js";

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const { email, userType, name, id: userId } = req.user;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isScheduled) {
      return res.status(400).json({
        success: false,
        message: "Event is not scheduled yet",
      });
    }

    const existingRegistration = await EventRegistration.findOne({
      eventId: eventId,
      userEmail: email,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    const currentRegistrations = await EventRegistration.countDocuments({
      eventId: eventId,
    });

    if (currentRegistrations >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: "Event has reached maximum attendees",
      });
    }

    // Create registration
    const registration = await EventRegistration.create({
      eventId,
      userEmail: email,
      userName: name,
      userType,
      registrationDate: new Date(),
    });

    // Send confirmation email with QR code
    try {
      const emailService = new EmailService();

      const eventRegistrationData = {
        email: email,
        name: name,
        userType: userType,
        userId: userId,
        eventName: event.title,
        eventDate: event.date,
        eventTime: event.eventTime,
        eventLocation: event.location || "Online",
        eventDescription: event.description,
        registrationId: registration._id,
        registrationDate: registration.registrationDate,
        eventId: eventId,
      };

      await emailService.sendEventRegistrationEmail(eventRegistrationData);
      console.log(`✅ Event registration email with QR code sent to ${email}`);
    } catch (emailError) {
      console.error("❌ Failed to send event registration email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event",
      data: registration,
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({
      success: false,
      message: "Error registering for event",
      error: error.message,
    });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email, userType } = req.user;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    // Check if event exists and user has permission
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is event organizer or admin
    if (event.organizerEmail !== email && userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only view registrations for your own events",
      });
    }

    const registrations = await EventRegistration.find({
      eventId: eventId,
    })
      .populate("eventId", "title date location organizer")
      .sort({ registrationDate: -1 });

    // Process registrations to match the expected structure
    const processedRegistrations = registrations.map((registration) => {
      const regData = registration.toObject
        ? registration.toObject()
        : registration;

      if (regData.eventId) {
        regData.event = {
          id: regData.eventId._id,
          title: regData.eventId.title,
          date: regData.eventId.date,
          location: regData.eventId.location,
          organizer: regData.eventId.organizer,
        };
        delete regData.eventId;
      }

      regData.id = regData._id || regData.id;
      return regData;
    });

    res.status(200).json({
      success: true,
      data: processedRegistrations,
      count: processedRegistrations.length,
    });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event registrations",
      error: error.message,
    });
  }
};

// Get events that need admin approval
export const getPendingEvents = async (req, res) => {
  try {
    const userType = req.user.userType;
    if (userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const pendingEvents = await Event.find({
      isScheduled: false,
    }).sort({ createdAt: -1 });

    if (!pendingEvents || pendingEvents.length === 0) {
      return res.status(200).json({ message: "No pending events found" });
    }

    return res.status(200).json({
      message: "Pending events fetched successfully",
      count: pendingEvents.length,
      events: pendingEvents,
    });
  } catch (error) {
    console.error("Error fetching pending events:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
