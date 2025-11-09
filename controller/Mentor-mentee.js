// controllers/mentorController.js
import Mentor from "../models/mentor.js";
import Alumni from "../models/alumni.js";
import Student from "../models/user.js";
import MentorStudent from "../models/mentee.js";

// Create mentor profile - only for Alumni userType
export const createMentor = async (req, res) => {
  try {
    // Check if user is authenticated and has Alumni userType
    if (!req.user || req.user.userType !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can create mentor profiles",
      });
    }

    const {
      batch_year,
      branch,
      current_position,
      company,
      linkedin_url,
      expertise,
      topics,
      availability,
      fees,
      available,
    } = req.body;

    // Get alumni details from req.user
    const { id: alumni_id, name, email, phone } = req.user;

    // Check if alumni exists in database
    const alumni = await Alumni.findByPk(alumni_id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found in database",
      });
    }

    // Check if mentor profile already exists for this alumni
    const existingMentor = await Mentor.findOne({
      where: { alumni_id },
    });

    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: "Mentor profile already exists for this alumni",
      });
    }

    // Validate required fields
    if (!batch_year || !branch) {
      return res.status(400).json({
        success: false,
        message: "Batch year and branch are required fields",
      });
    }

    // Create mentor profile using data from req.user and request body
    const mentor = await Mentor.create({
      alumni_id,
      name: name || "", // From req.user
      email: email || "", // From req.user
      phone: phone || "", // From req.user
      batch_year,
      branch,
      current_position: current_position || null,
      company: company || null,
      linkedin_url: linkedin_url || null,
      expertise: expertise || null,
      topics: topics || [],
      availability: availability || {},
      fees: fees || 0.0,
      available: available !== undefined ? available : true,
      mentee_students: [],
    });

    res.status(201).json({
      success: true,
      message: "Mentor profile created successfully",
      data: mentor,
    });
  } catch (error) {
    console.error("Error creating mentor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Edit mentor details - only for profile owner
export const editMentor = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { mentorId } = req.params;
    const {
      batch_year,
      branch,
      current_position,
      company,
      linkedin_url,
      expertise,
      topics,
      availability,
      fees,
      available,
    } = req.body;

    // Find mentor
    const mentor = await Mentor.findByPk(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Check if the logged-in user owns this mentor profile
    if (mentor.alumni_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own mentor profile",
      });
    }

    // Prepare update data (only allow specific fields to be updated)
    const updateData = {};

    if (batch_year !== undefined) updateData.batch_year = batch_year;
    if (branch !== undefined) updateData.branch = branch;
    if (current_position !== undefined)
      updateData.current_position = current_position;
    if (company !== undefined) updateData.company = company;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (topics !== undefined) updateData.topics = topics;
    if (availability !== undefined) updateData.availability = availability;
    if (fees !== undefined) updateData.fees = fees;
    if (available !== undefined) updateData.available = available;

    // Update mentor
    await mentor.update(updateData);

    // Fetch updated mentor
    const updatedMentor = await Mentor.findByPk(mentorId, {
      include: [
        {
          model: Alumni,
          as: "alumni",
          attributes: ["id", "name", "email", "profilePhoto"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Mentor profile updated successfully",
      data: updatedMentor,
    });
  } catch (error) {
    console.error("Error updating mentor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get current alumni's mentor profile
export const getMyMentorProfile = async (req, res) => {
  try {
    // Check if user is authenticated and is alumni
    if (!req.user || req.user.userType !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can access mentor profiles",
      });
    }

    const mentor = await Mentor.findOne({
      where: { alumni_id: req.user.id },
      include: [
        {
          model: Alumni,
          as: "alumni",
          attributes: ["id", "name", "email", "profilePhoto", "phone"],
        },
      ],
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
        data: null,
      });
    }

    res.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all mentors (public route)
export const getAllMentors = async (req, res) => {
  try {
    const { branch, expertise, available } = req.query;

    // Build filter conditions
    const whereConditions = { available: true }; // Only show available mentors by default

    if (branch) whereConditions.branch = branch;
    if (expertise) whereConditions.expertise = { [Op.like]: `%${expertise}%` };
    if (available !== undefined)
      whereConditions.available = available === "true";

    const mentors = await Mentor.findAll({
      where: whereConditions,
      include: [
        {
          model: Alumni,
          as: "alumni",
          attributes: ["id", "name", "email", "profilePhoto"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Check if alumni can create mentor profile
export const canCreateMentor = async (req, res) => {
  try {
    // Check if user is authenticated and is alumni
    if (!req.user || req.user.userType !== "alumni") {
      return res.json({
        success: true,
        canCreate: false,
        reason: "Only alumni can create mentor profiles",
      });
    }

    // Check if mentor profile already exists
    const existingMentor = await Mentor.findOne({
      where: { alumni_id: req.user.id },
    });

    if (existingMentor) {
      return res.json({
        success: true,
        canCreate: false,
        reason: "Mentor profile already exists",
        existingProfile: existingMentor.id,
      });
    }

    res.json({
      success: true,
      canCreate: true,
    });
  } catch (error) {
    console.error("Error checking mentor creation eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

import MentorshipEmailService from "../services/MentorshipEmailService.js";

const emailService = new MentorshipEmailService();

// Student requests to register under a mentor
export const requestMentorship = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only students can request mentorship",
      });
    }

    const { mentorId } = req.params;
    const { request_message, session_date, session_time } = req.body;
    const studentId = req.user.id;

    // Check if mentor exists and is available
    const mentor = await Mentor.findByPk(mentorId, {
      include: [
        {
          model: Alumni,
          as: "alumni",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    if (!mentor.available) {
      return res.status(400).json({
        success: false,
        message: "Mentor is currently not available for new mentees",
      });
    }

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if mentorship request already exists
    const existingRequest = await MentorStudent.findOne({
      where: {
        mentor_id: mentorId,
        student_id: studentId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: `Mentorship request already exists with status: ${existingRequest.status}`,
      });
    }

    // Create mentorship request
    const mentorship = await MentorStudent.create({
      mentor_id: mentorId,
      student_id: studentId,
      status: "pending",
      request_message: request_message || null,
      session_date: session_date || null,
      session_time: session_time || null,
      request_date: new Date().toISOString().split("T")[0],
      request_time: new Date().toTimeString().split(" ")[0],
    });

    // Send email notifications
    try {
      await emailService.sendMentorshipRequestEmail(
        mentor.alumni.email, // Mentor's email
        student.email, // Student's email
        {
          studentName: student.name,
          studentEmail: student.email,
          mentorName: mentor.name,
          requestMessage: request_message,
          sessionDate: session_date,
          sessionTime: session_time,
          requestDate: new Date(),
        }
      );
    } catch (emailError) {
      console.error("Failed to send email notifications:", emailError);
      // Continue with the response even if email fails
    }

    // Fetch created relationship with details
    const mentorshipWithDetails = await MentorStudent.findByPk(mentorship.id, {
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email", "profilePhoto"],
            },
          ],
        },
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email", "phone", "profilePhoto"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Mentorship request sent successfully",
      data: mentorshipWithDetails,
    });
  } catch (error) {
    console.error("Error requesting mentorship:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Mentor accepts/rejects mentorship request
export const respondToMentorshipRequest = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only mentors can respond to requests",
      });
    }

    const { requestId } = req.params;
    const { action, mentor_notes, session_date, session_time } = req.body;

    // Find mentorship request with mentor and student details
    const mentorship = await MentorStudent.findByPk(requestId, {
      include: [
        {
          model: Mentor,
          as: "mentor",
          where: { alumni_id: req.user.id },
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship request not found or access denied",
      });
    }

    if (mentorship.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${mentorship.status}`,
      });
    }

    let updateData = {};
    let newStatus = "";

    if (action === "accept") {
      newStatus = "active";
      updateData = {
        status: newStatus,
        session_date: session_date || mentorship.session_date,
        session_time: session_time || mentorship.session_time,
        mentor_notes: mentor_notes || null,
      };
    } else if (action === "reject") {
      newStatus = "cancelled";
      updateData = {
        status: newStatus,
        mentor_notes: mentor_notes || null,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'accept' or 'reject'",
      });
    }

    // Update mentorship status
    await mentorship.update(updateData);

    // Send email notifications
    try {
      await emailService.sendStatusChangeEmail(
        mentorship.mentor.alumni.email, // Mentor's email
        mentorship.student.email, // Student's email
        {
          studentName: mentorship.student.name,
          mentorName: mentorship.mentor.name,
          newStatus: newStatus,
          oldStatus: "pending",
          mentorNotes: mentor_notes,
          sessionDate: session_date || mentorship.session_date,
          sessionTime: session_time || mentorship.session_time,
        }
      );
    } catch (emailError) {
      console.error("Failed to send status change emails:", emailError);
      // Continue with the response even if email fails
    }

    // Fetch updated relationship with details
    const updatedMentorship = await MentorStudent.findByPk(requestId, {
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email", "profilePhoto"],
            },
          ],
        },
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email", "phone", "profilePhoto"],
        },
      ],
    });

    res.json({
      success: true,
      message: `Mentorship request ${action}ed successfully`,
      data: updatedMentorship,
    });
  } catch (error) {
    console.error("Error responding to mentorship request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update mentorship session details
export const updateSessionDetails = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { session_date, session_time, mentor_notes } = req.body;

    // Find mentorship with mentor and student details
    const mentorship = await MentorStudent.findByPk(requestId, {
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found",
      });
    }

    // Check authorization - either mentor or student can update
    const isMentor =
      req.user.userType === "alumni" &&
      mentorship.mentor.alumni_id === req.user.id;
    const isStudent =
      req.user.userType === "student" && mentorship.student_id === req.user.id;

    if (!isMentor && !isStudent) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own mentorships",
      });
    }

    const updateData = {};
    if (session_date !== undefined) updateData.session_date = session_date;
    if (session_time !== undefined) updateData.session_time = session_time;
    if (mentor_notes !== undefined) updateData.mentor_notes = mentor_notes;

    await mentorship.update(updateData);

    // Send email notifications for updates
    try {
      const updates = [];
      if (session_date) updates.push("session date");
      if (session_time) updates.push("session time");
      if (mentor_notes) updates.push("mentor notes");

      await emailService.sendMentorshipUpdateEmail(
        mentorship.mentor.alumni.email, // Mentor's email
        mentorship.student.email, // Student's email
        {
          studentName: mentorship.student.name,
          mentorName: mentorship.mentor.name,
          updates: updates.join(", "),
          sessionDate: session_date || mentorship.session_date,
          sessionTime: session_time || mentorship.session_time,
        }
      );
    } catch (emailError) {
      console.error("Failed to send update emails:", emailError);
      // Continue with the response even if email fails
    }

    res.json({
      success: true,
      message: "Session details updated successfully",
      data: mentorship,
    });
  } catch (error) {
    console.error("Error updating session details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all mentorship requests for a mentor
export const getMentorshipRequests = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only mentors can view requests",
      });
    }

    const { status } = req.query;

    // Find mentor profile for this alumni
    const mentor = await Mentor.findOne({
      where: { alumni_id: req.user.id },
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const whereConditions = { mentor_id: mentor.id };
    if (status) whereConditions.status = status;

    const requests = await MentorStudent.findAll({
      where: whereConditions,
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email", "phone", "profilePhoto"],
        },
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email", "profilePhoto"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get student's mentorship requests and relationships
export const getStudentMentorships = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only students can view their mentorships",
      });
    }

    const studentId = req.user.id;
    const { status } = req.query;

    const whereConditions = { student_id: studentId };
    if (status) whereConditions.status = status;

    const mentorships = await MentorStudent.findAll({
      where: whereConditions,
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email", "profilePhoto"],
            },
          ],
        },
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email", "phone", "profilePhoto"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: mentorships.length,
      data: mentorships,
    });
  } catch (error) {
    console.error("Error fetching student mentorships:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Complete/cancel active mentorship
export const updateMentorshipStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, notes } = req.body;

    // Find mentorship with mentor and student details
    const mentorship = await MentorStudent.findByPk(requestId, {
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: Alumni,
              as: "alumni",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found",
      });
    }

    // Check authorization - either mentor or student can update
    const isMentor =
      req.user.userType === "alumni" &&
      mentorship.mentor.alumni_id === req.user.id;
    const isStudent =
      req.user.userType === "student" && mentorship.student_id === req.user.id;

    if (!isMentor && !isStudent) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own mentorships",
      });
    }

    let updateData = {};
    let newStatus = "";

    if (action === "complete" && mentorship.status === "active") {
      newStatus = "completed";
      updateData = {
        status: newStatus,
        mentor_notes: notes || mentorship.mentor_notes,
      };
    } else if (
      action === "cancel" &&
      (mentorship.status === "pending" || mentorship.status === "active")
    ) {
      newStatus = "cancelled";
      updateData = {
        status: newStatus,
        mentor_notes: notes || mentorship.mentor_notes,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid action or current status doesn't allow ${action}`,
      });
    }

    await mentorship.update(updateData);

    // Send email notifications for status change
    try {
      await emailService.sendStatusChangeEmail(
        mentorship.mentor.alumni.email, // Mentor's email
        mentorship.student.email, // Student's email
        {
          studentName: mentorship.student.name,
          mentorName: mentorship.mentor.name,
          newStatus: newStatus,
          oldStatus: mentorship.status,
          mentorNotes: notes || mentorship.mentor_notes,
          sessionDate: mentorship.session_date,
          sessionTime: mentorship.session_time,
        }
      );
    } catch (emailError) {
      console.error("Failed to send status change emails:", emailError);
      // Continue with the response even if email fails
    }

    res.json({
      success: true,
      message: `Mentorship ${action}d successfully`,
      data: mentorship,
    });
  } catch (error) {
    console.error("Error updating mentorship status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
