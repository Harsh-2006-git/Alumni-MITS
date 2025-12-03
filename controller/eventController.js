import Event from "../models/event.js";
import EventRegistration from "../models/eventRegistration.js";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "cloudinary";

// ---------------------------------------------
// Configure Multer for Memory Storage
// ---------------------------------------------
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// ---------------------------------------------
// Cloudinary Upload Utility
// ---------------------------------------------
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "image/gif",
      ].includes(file.mimetype)
    ) {
      return reject(
        new Error("Only JPEG, JPG, PNG, WebP and GIF images are allowed")
      );
    }

    const publicId = `events/${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    const stream = cloudinary.v2.uploader.upload_stream(
      {
        public_id: publicId,
        folder: "events",
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          reject(new Error("Error uploading to Cloudinary"));
        } else {
          resolve(uploadResult.secure_url);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// ---------------------------------------------
// CREATE EVENT (with multer middleware)
// ---------------------------------------------
export const addEvent = [
  upload.single("image"), // This middleware will parse the FormData and attach file to req.file
  async (req, res) => {
    try {
      // Log the request body for debugging
      console.log("Request body:", req.body);
      console.log("File received:", req.file ? "Yes" : "No");

      // Check if user is authenticated
      if (!req.user || !req.user.email) {
        return res.status(401).json({
          message: "Authentication required. Please login again.",
        });
      }

      const { email, userType } = req.user;

      // Log the received data
      console.log("User email from token:", email);
      console.log("User type:", userType);

      // Parse req.body fields (they come as strings from FormData)
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
      } = req.body;

      // ---------------------------------------------
      // Validate required fields
      // ---------------------------------------------
      if (!title || !date || !location || !organizer) {
        return res.status(400).json({
          message: "Title, date, location and organizer are required fields",
          receivedData: {
            title: !!title,
            date: !!date,
            location: !!location,
            organizer: !!organizer,
          },
        });
      }

      // Parse numeric fields
      const parsedPrice = price ? parseFloat(price) : 0;
      const parsedMaxAttendees = maxAttendees ? parseInt(maxAttendees, 10) : 50;

      // ---------------------------------------------
      // Upload Event Image (if provided)
      // ---------------------------------------------
      let imageUrl = null;

      if (req.file) {
        try {
          console.log("Uploading image to Cloudinary...");
          imageUrl = await uploadToCloudinary(req.file);
          console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadError) {
          console.error("❌ Cloudinary upload error:", uploadError);
          return res.status(500).json({
            message: "Error uploading image to Cloudinary",
            error: uploadError.message,
          });
        }
      } else if (req.body.image && req.body.image.trim() !== "") {
        // Use provided URL if no file uploaded
        imageUrl = req.body.image.trim();
      }

      // ---------------------------------------------
      // Create Event
      // ---------------------------------------------
      const isCollegeAdmin = userType === "admin";

      console.log("Creating event with data:", {
        title,
        date,
        location,
        organizer,
        organizerEmail: email,
        isScheduled: isCollegeAdmin,
      });

      const event = await Event.create({
        title: title.trim(),
        description: description ? description.trim() : "",
        date,
        location: location.trim(),
        price: parsedPrice,
        organizer: organizer.trim(),
        organizerEmail: email, // from token
        category: category || "educational",
        type: type || "in-person",
        maxAttendees: parsedMaxAttendees,
        image: imageUrl,
        isScheduled: isCollegeAdmin, // auto approve for admin
        userType,
      });

      console.log("✅ Event created successfully:", event._id);

      return res.status(201).json({
        message: "Event created successfully",
        event: {
          id: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
          organizer: event.organizer,
          image: event.image,
          isScheduled: event.isScheduled,
        },
      });
    } catch (error) {
      console.error("❌ Error adding event:", error);
      console.error("Error stack:", error.stack);

      // Handle specific errors
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({
          message: "Invalid or expired token. Please login again.",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          message: "Duplicate event detected",
        });
      }

      return res.status(500).json({
        message: "Server error while creating event",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
];
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
