// controllers/mentorController.js
import Mentor from "../models/mentor.js";
import Alumni from "../models/alumni.js";
import Student from "../models/user.js";
import MentorStudent from "../models/mentee.js";
import MentorshipEmailService from "../services/MentorshipEmailService.js";
import mongoose from "mongoose";

const emailService = new MentorshipEmailService();

// Helper function to process MongoDB data to match Sequelize response structure
const processMentorData = (mentor) => {
  const mentorData = mentor.toObject ? mentor.toObject() : mentor;

  // Convert Decimal128 fees to number
  if (mentorData.fees && typeof mentorData.fees === "object") {
    mentorData.fees = parseFloat(mentorData.fees.toString());
  }

  // Ensure id field is present (matching Sequelize response)
  mentorData.id = mentorData._id || mentorData.id;

  return mentorData;
};

// Helper function to process mentorship data
const processMentorshipData = (mentorship) => {
  const mentorshipData = mentorship.toObject
    ? mentorship.toObject()
    : mentorship;

  // Ensure id field is present
  mentorshipData.id = mentorshipData._id || mentorshipData.id;

  return mentorshipData;
};

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
    const alumni = await Alumni.findById(alumni_id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found in database",
      });
    }

    // Check if mentor profile already exists for this alumni
    const existingMentor = await Mentor.findOne({
      alumni_id: alumni_id,
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
      data: processMentorData(mentor),
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
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Check if the logged-in user owns this mentor profile
    if (mentor.alumni_id.toString() !== req.user.id) {
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
    const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, updateData, {
      new: true,
    }).populate("alumni_id", "name email profilePhoto");

    // Structure response to match Sequelize include format
    const responseData = processMentorData(updatedMentor);
    if (updatedMentor.alumni_id) {
      responseData.alumni = {
        id: updatedMentor.alumni_id._id,
        name: updatedMentor.alumni_id.name,
        email: updatedMentor.alumni_id.email,
        profilePhoto: updatedMentor.alumni_id.profilePhoto,
      };
    }

    res.json({
      success: true,
      message: "Mentor profile updated successfully",
      data: responseData,
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
      alumni_id: req.user.id,
    }).populate("alumni_id", "name email profilePhoto phone");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
        data: null,
      });
    }

    // Structure response to match Sequelize include format
    const responseData = processMentorData(mentor);
    if (mentor.alumni_id) {
      responseData.alumni = {
        id: mentor.alumni_id._id,
        name: mentor.alumni_id.name,
        email: mentor.alumni_id.email,
        profilePhoto: mentor.alumni_id.profilePhoto,
        phone: mentor.alumni_id.phone,
      };
    }

    res.json({
      success: true,
      data: responseData,
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
    if (expertise)
      whereConditions.expertise = { $regex: expertise, $options: "i" };
    if (available !== undefined)
      whereConditions.available = available === "true";

    const mentors = await Mentor.find(whereConditions)
      .populate("alumni_id", "name email profilePhoto")
      .sort({ createdAt: -1 });

    // Process mentors to match Sequelize response structure
    const processedMentors = mentors.map((mentor) => {
      const mentorData = processMentorData(mentor);

      // Structure alumni data to match Sequelize include
      if (mentor.alumni_id) {
        mentorData.alumni = {
          id: mentor.alumni_id._id,
          name: mentor.alumni_id.name,
          email: mentor.alumni_id.email,
          profilePhoto: mentor.alumni_id.profilePhoto,
        };
      }

      return mentorData;
    });

    res.json({
      success: true,
      count: processedMentors.length,
      data: processedMentors,
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
      alumni_id: req.user.id,
    });

    if (existingMentor) {
      return res.json({
        success: true,
        canCreate: false,
        reason: "Mentor profile already exists",
        existingProfile: existingMentor._id,
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
    const mentor = await Mentor.findById(mentorId).populate(
      "alumni_id",
      "name email"
    );

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
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if mentorship request already exists
    const existingRequest = await MentorStudent.findOne({
      mentor_id: mentorId,
      student_id: studentId,
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
        mentor.alumni_id.email, // Mentor's email
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
    const mentorshipWithDetails = await MentorStudent.findById(mentorship._id)
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email profilePhoto",
        },
      })
      .populate("student_id", "name email phone profilePhoto");

    // Structure response to match Sequelize include format
    const responseData = processMentorshipData(mentorshipWithDetails);
    if (mentorshipWithDetails.mentor_id) {
      responseData.mentor = {
        id: mentorshipWithDetails.mentor_id._id,
        name: mentorshipWithDetails.mentor_id.name,
        alumni: {
          id: mentorshipWithDetails.mentor_id.alumni_id._id,
          name: mentorshipWithDetails.mentor_id.alumni_id.name,
          email: mentorshipWithDetails.mentor_id.alumni_id.email,
          profilePhoto: mentorshipWithDetails.mentor_id.alumni_id.profilePhoto,
        },
      };
    }
    if (mentorshipWithDetails.student_id) {
      responseData.student = {
        id: mentorshipWithDetails.student_id._id,
        name: mentorshipWithDetails.student_id.name,
        email: mentorshipWithDetails.student_id.email,
        phone: mentorshipWithDetails.student_id.phone,
        profilePhoto: mentorshipWithDetails.student_id.profilePhoto,
      };
    }

    res.status(201).json({
      success: true,
      message: "Mentorship request sent successfully",
      data: responseData,
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

    // Find mentorship request
    const mentorship = await MentorStudent.findById(requestId)
      .populate({
        path: "mentor_id",
        match: { alumni_id: req.user.id },
        populate: {
          path: "alumni_id",
          select: "name email",
        },
      })
      .populate("student_id", "name email");

    if (!mentorship || !mentorship.mentor_id) {
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
    const updatedMentorship = await MentorStudent.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    )
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email profilePhoto",
        },
      })
      .populate("student_id", "name email phone profilePhoto");

    // Send email notifications
    try {
      await emailService.sendStatusChangeEmail(
        updatedMentorship.mentor_id.alumni_id.email, // Mentor's email
        updatedMentorship.student_id.email, // Student's email
        {
          studentName: updatedMentorship.student_id.name,
          mentorName: updatedMentorship.mentor_id.name,
          newStatus: newStatus,
          oldStatus: "pending",
          mentorNotes: mentor_notes,
          sessionDate: session_date || updatedMentorship.session_date,
          sessionTime: session_time || updatedMentorship.session_time,
        }
      );
    } catch (emailError) {
      console.error("Failed to send status change emails:", emailError);
      // Continue with the response even if email fails
    }

    // Structure response to match Sequelize include format
    const responseData = processMentorshipData(updatedMentorship);
    if (updatedMentorship.mentor_id) {
      responseData.mentor = {
        id: updatedMentorship.mentor_id._id,
        name: updatedMentorship.mentor_id.name,
        alumni: {
          id: updatedMentorship.mentor_id.alumni_id._id,
          name: updatedMentorship.mentor_id.alumni_id.name,
          email: updatedMentorship.mentor_id.alumni_id.email,
          profilePhoto: updatedMentorship.mentor_id.alumni_id.profilePhoto,
        },
      };
    }
    if (updatedMentorship.student_id) {
      responseData.student = {
        id: updatedMentorship.student_id._id,
        name: updatedMentorship.student_id.name,
        email: updatedMentorship.student_id.email,
        phone: updatedMentorship.student_id.phone,
        profilePhoto: updatedMentorship.student_id.profilePhoto,
      };
    }

    res.json({
      success: true,
      message: `Mentorship request ${action}ed successfully`,
      data: responseData,
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

// Update mentorship session details - fixed version
export const updateSessionDetails = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { session_date, session_time, mentor_notes } = req.body;

    // Find mentorship
    const mentorship = await MentorStudent.findById(requestId)
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email",
        },
      })
      .populate("student_id", "name email");

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found",
      });
    }

    // Check authorization - either mentor or student can update
    const isMentor = req.user.userType === "alumni";
    const isStudent = req.user.userType === "student";

    if (isMentor) {
      // For alumni, check if they own the mentor profile in this mentorship
      // Directly compare the alumni_id from the populated mentor with the logged-in user
      if (mentorship.mentor_id.alumni_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update your own mentorships",
        });
      }
    } else if (isStudent) {
      // For students, check if they own the student profile
      if (mentorship.student_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update your own mentorships",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updateData = {};
    if (session_date !== undefined) updateData.session_date = session_date;
    if (session_time !== undefined) updateData.session_time = session_time;
    if (mentor_notes !== undefined) updateData.mentor_notes = mentor_notes;

    const updatedMentorship = await MentorStudent.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    )
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email profilePhoto",
        },
      })
      .populate("student_id", "name email phone profilePhoto");

    // Send email notifications for updates
    try {
      const updates = [];
      if (session_date) updates.push("session date");
      if (session_time) updates.push("session time");
      if (mentor_notes) updates.push("mentor notes");

      await emailService.sendMentorshipUpdateEmail(
        updatedMentorship.mentor_id.alumni_id.email,
        updatedMentorship.student_id.email,
        {
          studentName: updatedMentorship.student_id.name,
          mentorName: updatedMentorship.mentor_id.name,
          updates: updates.join(", "),
          sessionDate: session_date || updatedMentorship.session_date,
          sessionTime: session_time || updatedMentorship.session_time,
        }
      );
    } catch (emailError) {
      console.error("Failed to send update emails:", emailError);
    }

    // Structure response to match Sequelize include format
    const responseData = processMentorshipData(updatedMentorship);
    if (updatedMentorship.mentor_id) {
      responseData.mentor = {
        id: updatedMentorship.mentor_id._id,
        name: updatedMentorship.mentor_id.name,
        alumni: {
          id: updatedMentorship.mentor_id.alumni_id._id,
          name: updatedMentorship.mentor_id.alumni_id.name,
          email: updatedMentorship.mentor_id.alumni_id.email,
          profilePhoto: updatedMentorship.mentor_id.alumni_id.profilePhoto,
        },
      };
    }
    if (updatedMentorship.student_id) {
      responseData.student = {
        id: updatedMentorship.student_id._id,
        name: updatedMentorship.student_id.name,
        email: updatedMentorship.student_id.email,
        phone: updatedMentorship.student_id.phone,
        profilePhoto: updatedMentorship.student_id.profilePhoto,
      };
    }

    res.json({
      success: true,
      message: "Session details updated successfully",
      data: responseData,
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
      alumni_id: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const whereConditions = { mentor_id: mentor._id };
    if (status) whereConditions.status = status;

    const requests = await MentorStudent.find(whereConditions)
      .populate("student_id", "name email phone profilePhoto")
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email profilePhoto",
        },
      })
      .sort({ createdAt: -1 });

    // Process requests to match Sequelize response structure
    const processedRequests = requests.map((request) => {
      const requestData = processMentorshipData(request);

      // Structure data to match Sequelize include
      if (request.student_id) {
        requestData.student = {
          id: request.student_id._id,
          name: request.student_id.name,
          email: request.student_id.email,
          phone: request.student_id.phone,
          profilePhoto: request.student_id.profilePhoto,
        };
      }
      if (request.mentor_id) {
        requestData.mentor = {
          id: request.mentor_id._id,
          name: request.mentor_id.name,
          alumni: {
            id: request.mentor_id.alumni_id._id,
            name: request.mentor_id.alumni_id.name,
            email: request.mentor_id.alumni_id.email,
            profilePhoto: request.mentor_id.alumni_id.profilePhoto,
          },
        };
      }

      return requestData;
    });

    res.json({
      success: true,
      count: processedRequests.length,
      data: processedRequests,
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

    const mentorships = await MentorStudent.find(whereConditions)
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email profilePhoto",
        },
      })
      .populate("student_id", "name email phone profilePhoto")
      .sort({ createdAt: -1 });

    // Process mentorships to match Sequelize response structure
    const processedMentorships = mentorships.map((mentorship) => {
      const mentorshipData = processMentorshipData(mentorship);

      // Structure data to match Sequelize include
      if (mentorship.mentor_id) {
        mentorshipData.mentor = {
          id: mentorship.mentor_id._id,
          name: mentorship.mentor_id.name,
          alumni: {
            id: mentorship.mentor_id.alumni_id._id,
            name: mentorship.mentor_id.alumni_id.name,
            email: mentorship.mentor_id.alumni_id.email,
            profilePhoto: mentorship.mentor_id.alumni_id.profilePhoto,
          },
        };
      }
      if (mentorship.student_id) {
        mentorshipData.student = {
          id: mentorship.student_id._id,
          name: mentorship.student_id.name,
          email: mentorship.student_id.email,
          phone: mentorship.student_id.phone,
          profilePhoto: mentorship.student_id.profilePhoto,
        };
      }

      return mentorshipData;
    });

    res.json({
      success: true,
      count: processedMentorships.length,
      data: processedMentorships,
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

    // Find mentorship
    const mentorship = await MentorStudent.findById(requestId)
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email",
        },
      })
      .populate("student_id", "name email");

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found",
      });
    }

    // Check authorization - either mentor or student can update
    const isMentor = req.user.userType === "alumni";
    const isStudent = req.user.userType === "student";

    if (isMentor) {
      const mentor = await Mentor.findById(mentorship.mentor_id);
      if (!mentor || mentor.alumni_id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update your own mentorships",
        });
      }
    } else if (isStudent) {
      if (mentorship.student_id._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update your own mentorships",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
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

    const updatedMentorship = await MentorStudent.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    )
      .populate({
        path: "mentor_id",
        populate: {
          path: "alumni_id",
          select: "name email",
        },
      })
      .populate("student_id", "name email");

    // Send email notifications for status change
    try {
      await emailService.sendStatusChangeEmail(
        updatedMentorship.mentor_id.alumni_id.email, // Mentor's email
        updatedMentorship.student_id.email, // Student's email
        {
          studentName: updatedMentorship.student_id.name,
          mentorName: updatedMentorship.mentor_id.name,
          newStatus: newStatus,
          oldStatus: mentorship.status,
          mentorNotes: notes || updatedMentorship.mentor_notes,
          sessionDate: updatedMentorship.session_date,
          sessionTime: updatedMentorship.session_time,
        }
      );
    } catch (emailError) {
      console.error("Failed to send status change emails:", emailError);
      // Continue with the response even if email fails
    }

    res.json({
      success: true,
      message: `Mentorship ${action}d successfully`,
      data: updatedMentorship,
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
