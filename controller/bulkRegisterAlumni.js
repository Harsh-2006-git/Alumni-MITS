// controller/bulkRegisterAlumni.js
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import bcrypt from "bcrypt";
import AlumniProfile from "../models/AlumniProfile.js";
import Alumni from "../models/alumni.js";
import EmailService from "../services/NewUserEmailService.js";

// Configure multer for file upload
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/csv"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
});

const emailService = new EmailService();

// Configuration
const CONFIG = {
  MAX_RECORDS: 1000,
  BATCH_SIZE: 150,
  EMAIL_DELAY: 1, // ms between emails
  PASSWORD_LENGTH: 4,
};

// Utility functions
const generateRandomDigits = (length = CONFIG.PASSWORD_LENGTH) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
};

const validateBatchYear = (batch) => {
  const batchRegex = /^\d{4}-\d{4}$/;
  if (!batchRegex.test(batch)) return false;

  const [startYear, endYear] = batch.split("-").map(Number);
  const currentYear = new Date().getFullYear();

  return (
    startYear < endYear &&
    endYear - startYear <= 6 &&
    startYear >= 2000 &&
    endYear <= currentYear + 6
  );
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const cleanedPhone = phone.toString().replace(/\D/g, "");
  return cleanedPhone.length >= 10 && cleanedPhone.length <= 15;
};

const sanitizePhone = (phone) => {
  return phone.toString().replace(/\D/g, "").substring(0, 15);
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim();
};

const sanitizeLinkedInUrl = (url) => {
  if (!url || url.trim() === "" || url === "Not provided") return null;

  let sanitizedUrl = url.trim();

  if (!sanitizedUrl.startsWith("http")) {
    sanitizedUrl = "https://" + sanitizedUrl;
  }

  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;
  if (!linkedinRegex.test(sanitizedUrl)) {
    return null;
  }

  return sanitizedUrl;
};

const sanitizeLocation = (location) => {
  if (!location || location.trim() === "" || location === "Not provided")
    return null;
  return location.trim();
};

// Generate education data from batch year in EXACT format you specified
const generateEducationFromBatch = (batchYear, branch) => {
  if (!batchYear || !validateBatchYear(batchYear)) {
    return null;
  }

  const [startYear, endYear] = batchYear.split("-").map(Number);

  // Generate dates - 1st August of start year to 30th May of end year (EXACT format you wanted)
  const startDate = `${startYear}-08-01`; // 1st August of start year
  const endDate = `${endYear}-05-30`; // 30th May of end year

  // Create education entry in EXACT format you specified
  const educationEntry = {
    type: "Bachelor", // Fixed as "Bachelor" as per your requirement
    stream: branch, // Use the branch from CSV
    institution: "MITS Gwalior", // Fixed as "MITS Gwalior" as per your requirement
    from: startDate, // 1st August format
    to: endDate, // 30th May format
    gpa: "7.5", // You can set default GPA or make it configurable
  };

  // Return as array to match your model structure
  return [educationEntry];
};

// Check for existing records in bulk
const checkExistingRecords = async (emails, phones) => {
  const existingEmails = await Alumni.find({ email: { $in: emails } }, "email");

  const existingPhones = await Alumni.find(
    { phone: { $in: phones.map((phone) => sanitizePhone(phone)) } },
    "phone"
  );

  return {
    existingEmails: new Set(existingEmails.map((e) => e.email.toLowerCase())),
    existingPhones: new Set(existingPhones.map((p) => p.phone)),
  };
};

// Delay utility for rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced bulk registration controller with exact education format
const BulkRegisterAlumni = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
      });
    }

    const results = [];
    const errors = [];
    const successfulRegistrations = [];

    // Parse CSV file
    const stream = Readable.from(req.file.buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => {
          const cleanedData = {};
          Object.keys(data).forEach((key) => {
            cleanedData[key.trim()] = sanitizeInput(data[key]);
          });
          results.push(cleanedData);
        })
        .on("end", resolve)
        .on("error", (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        });
    });

    // Validate record count
    if (results.length > CONFIG.MAX_RECORDS) {
      return res.status(400).json({
        success: false,
        message: `Too many records. Maximum allowed is ${CONFIG.MAX_RECORDS}.`,
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty or contains no valid data.",
      });
    }

    // Pre-check for duplicates
    const emails = results.map((row) => row.email?.toLowerCase().trim());
    const phones = results.map((row) => row.phone);

    const { existingEmails, existingPhones } = await checkExistingRecords(
      emails,
      phones
    );

    // Process records
    for (const [index, row] of results.entries()) {
      const rowNumber = index + 1;

      try {
        const { name, email, phone, branch, batchYear, location, linkedinUrl } =
          row;

        console.log(`Processing row ${rowNumber}:`, {
          name,
          email,
          batchYear,
          branch,
        });

        // Validate required fields
        if (!name || !email || !phone || !branch || !batchYear) {
          errors.push({
            row: rowNumber,
            field: "required_fields",
            value: "",
            message:
              "Missing required fields (name, email, phone, branch, or batchYear)",
          });
          continue;
        }

        // Validate email
        if (!validateEmail(email)) {
          errors.push({
            row: rowNumber,
            field: "email",
            value: email,
            message: "Invalid email format",
          });
          continue;
        }

        // Check for duplicate email
        const normalizedEmail = email.toLowerCase().trim();
        if (existingEmails.has(normalizedEmail)) {
          errors.push({
            row: rowNumber,
            field: "email",
            value: email,
            message: "Email already exists in system",
          });
          continue;
        }

        // Validate phone
        if (!validatePhone(phone)) {
          errors.push({
            row: rowNumber,
            field: "phone",
            value: phone,
            message: "Invalid phone number format",
          });
          continue;
        }

        // Check for duplicate phone
        const sanitizedPhone = sanitizePhone(phone);
        if (existingPhones.has(sanitizedPhone)) {
          errors.push({
            row: rowNumber,
            field: "phone",
            value: phone,
            message: "Phone number already exists in system",
          });
          continue;
        }

        // Validate batch year
        if (!validateBatchYear(batchYear)) {
          errors.push({
            row: rowNumber,
            field: "batchYear",
            value: batchYear,
            message:
              "Invalid batch year format. Use format: YYYY-YYYY (e.g., 2020-2024)",
          });
          continue;
        }

        // Sanitize location and LinkedIn URL
        const sanitizedLocation = sanitizeLocation(location);
        const sanitizedLinkedIn = sanitizeLinkedInUrl(linkedinUrl);

        // Generate education data from batch year in EXACT format
        const education = generateEducationFromBatch(batchYear, branch);

        console.log(
          "Generated education (exact format):",
          JSON.stringify(education, null, 2)
        );

        // Generate password
        const randomDigits = generateRandomDigits();
        const firstName = name.split(" ")[0].toLowerCase();
        const password = `${firstName}@${randomDigits}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
          // Create alumni record
          const alumni = await Alumni.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: sanitizedPhone,
            branch: branch.trim(),
            password: hashedPassword,
            userType: "alumni",
            isVerified: true,
          });

          // Create alumni profile with education data in EXACT format
          const alumniProfileData = {
            alumniId: alumni._id,
            branch: branch.trim(),
            batch: batchYear.trim(),
            location: sanitizedLocation,
            linkedin: sanitizedLinkedIn,
            education: education, // This will save the generated education data in exact format
          };

          console.log("Creating profile with exact education format");

          await AlumniProfile.create(alumniProfileData);

          // Add to successful registrations
          successfulRegistrations.push({
            name: alumni.name,
            email: alumni.email,
            phone: alumni.phone,
            branch: alumni.branch,
            batchYear: batchYear.trim(),
            location: sanitizedLocation || "Not provided",
            linkedinUrl: sanitizedLinkedIn || "Not provided",
            education: education, // Include education in response for verification
            temporaryPassword: password,
          });

          // Add to existing sets to prevent duplicates in same batch
          existingEmails.add(normalizedEmail);
          existingPhones.add(sanitizedPhone);

          // Send welcome email with delay
          try {
            await delay(CONFIG.EMAIL_DELAY);
            const userWithCredentials = {
              ...alumni.toJSON(),
              temporaryPassword: password,
              batchYear: batchYear.trim(),
              location: sanitizedLocation,
              linkedinUrl: sanitizedLinkedIn,
              education: education,
            };

            await emailService.sendWelcomeEmail(userWithCredentials);
            console.log(`✅ Welcome email sent to ${alumni.email}`);
          } catch (emailError) {
            console.error(
              `❌ Failed to send welcome email to ${alumni.email}:`,
              emailError
            );
            errors.push({
              row: rowNumber,
              field: "email_service",
              value: alumni.email,
              message: `Email sending failed: ${emailError.message}`,
            });
          }
        } catch (transactionError) {
          console.error(
            `Transaction error for row ${rowNumber}:`,
            transactionError
          );
          errors.push({
            row: rowNumber,
            field: "database",
            value: "",
            message: `Database error: ${transactionError.message}`,
          });
        }
      } catch (error) {
        console.error(`General error for row ${rowNumber}:`, error);
        errors.push({
          row: rowNumber,
          field: "processing",
          value: "",
          message: `Processing error: ${error.message}`,
        });
      }
    }

    // Prepare response
    const response = {
      success: true,
      message: "Bulk registration completed",
      summary: {
        totalProcessed: results.length,
        successful: successfulRegistrations.length,
        failed: errors.length,
        successRate: `${(
          (successfulRegistrations.length / results.length) *
          100
        ).toFixed(1)}%`,
      },
      successfulRegistrations:
        successfulRegistrations.length > 0
          ? successfulRegistrations
          : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log(
      `Bulk registration completed: ${successfulRegistrations.length}/${results.length} successful`
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Bulk registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk registration",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export default BulkRegisterAlumni;