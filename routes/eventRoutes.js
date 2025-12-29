import express from "express";
import {
  addEvent,
  getUpcomingEvents,
  reviewEvent,
  updateEvent,
  registerForEvent,
  deleteEvent,
  getEventRegistrations,
  downloadRegistrations,
  getmyevents,
  getallEvents,
} from "../controller/eventController.js";
import authenticateClient from "../middlewares/authMiddleware.js";
const router = express.Router();

// Protected route
router.post("/add-event", authenticateClient, addEvent);
router.get("/my-events", authenticateClient, getmyevents);
router.get("/upcoming-event", getUpcomingEvents);
router.get("/all-event", getallEvents);
router.put("/review/:eventId", authenticateClient, reviewEvent);
router.put("/update/:id", authenticateClient, updateEvent);
router.delete("/delete/:id", authenticateClient, deleteEvent);
router.post("/registration", authenticateClient, registerForEvent);

// Get registrations for specific event (organizer/admin)
router.get(
  "/event-registrations/:eventId",
  authenticateClient,
  getEventRegistrations
);
router.get(
  "/download-registrations/:eventId",
  authenticateClient,
  downloadRegistrations
);

export default router;
