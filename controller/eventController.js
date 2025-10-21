import Event from "../models/event.js";
import EventRegistration from "../models/eventRegistration.js";


export const addEvent = async (req, res) => {
  try {
    const { email, userType } = req.user; // assuming your token contains { email: "..." }
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
    // ✅ Create new event (use single block, dynamic isScheduled)
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

    const event = await Event.findByPk(id);
    const eventRegistration = await EventRegistration.findAll({where: eventId=id})

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.destroy();

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
// find the event which doest not have paased yet
import { Op } from "sequelize";

export const getallEvents = async (req, res) => {
  try {
    const today = new Date();

    const upcomingEvents = await Event.findAll({
      where: {
        // ✅ Only approved/scheduled events
        date: {
          [Op.gt]: today, // ✅ Future events only
        },
      },
      order: [["date", "ASC"]], // Sort by nearest date first
    });

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res
        .status(404)
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
export const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();

    const upcomingEvents = await Event.findAll({
      where: {
        isScheduled: true,
        // ✅ Only approved/scheduled events
        date: {
          [Op.gt]: today, // ✅ Future events only
        },
      },
      order: [["date", "ASC"]], // Sort by nearest date first
    });

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res
        .status(404)
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
    const today = new Date();
    const { email, userType } = req.user;

    const upcomingEvents = await Event.findAll({
      where: {
        organizerEmail: email,
        userType: userType,
        isScheduled: true, // ✅ Only approved/scheduled events
        date: {
          [Op.gt]: today, // ✅ Future events only
        },
      },
      order: [["date", "ASC"]], // Sort by nearest date first
    });

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res
        .status(404)
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

// ✅ Accept or Reject Event by Admin
export const reviewEvent = async (req, res) => {
  try {
    const userType = req.user.userType; // from JWT middleware
    if (userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { eventId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    // ✅ Find event
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (action === "accept") {
      event.isScheduled = true;
      await event.save();

      return res.status(200).json({
        message: "Event accepted successfully",
        event,
      });
    } else if (action === "reject") {
      await event.destroy();

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

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.email !== email && event.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own event",
      });
    }

    // Update event with all fields
    await event.update({
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
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
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


// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const { email, userType, name } = req.user; // Get from JWT token

    // Validate required fields
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if event is scheduled
    if (!event.isScheduled) {
      return res.status(400).json({
        success: false,
        message: "Event is not scheduled yet",
      });
    }

    // Check if user is already registered for this event
    const existingRegistration = await EventRegistration.findOne({
      where: {
        eventId,
        userEmail: email,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Check if event has reached maximum attendees
    const currentRegistrations = await EventRegistration.count({
      where: { eventId },
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
      registrationDate: new Date(), // Current date
    });

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

    // Check if event exists and user has permission
    const event = await Event.findByPk(eventId);
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

    const registrations = await EventRegistration.findAll({
      where: { eventId },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "date", "location", "organizer"],
        },
      ],
      order: [["registrationDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: registrations,
      count: registrations.length,
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
