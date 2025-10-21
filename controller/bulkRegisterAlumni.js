// controller/bulkRegisterAlumni.js
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";
import AlumniProfile from "../models/AlumniProfile.js";
import Alumni from "../models/alumni.js";
import EmailService from "../services/NewUserEmailService.js";

// Configure multer for file upload
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const emailService = new EmailService();

// Generate random 4-digit number
const generateRandomDigits = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Bulk register alumni from CSV/Excel
const BulkRegisterAlumni = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const errors = [];
    const successfulRegistrations = [];

    // Create readable stream from buffer
    const stream = Readable.from(req.file.buffer);

    // Parse CSV file
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Process each row
    for (const [index, row] of results.entries()) {
      try {
        const { name, email, phone, branch } = row;

        // Validate required fields
        if (!name || !email || !phone || !branch) {
          errors.push(
            `Row ${
              index + 1
            }: Missing required fields (name, email, phone, or branch)`
          );
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push(`Row ${index + 1}: Invalid email format - ${email}`);
          continue;
        }

        // Validate phone format
        const phoneRegex = /^[0-9+\-() ]+$/;
        if (!phoneRegex.test(phone)) {
          errors.push(`Row ${index + 1}: Invalid phone format - ${phone}`);
          continue;
        }

        // Validate branch (should not be empty)
        if (!branch.trim()) {
          errors.push(`Row ${index + 1}: Branch cannot be empty`);
          continue;
        }

        // Check if email already exists
        const existingEmail = await Alumni.findOne({ where: { email } });
        if (existingEmail) {
          errors.push(`Row ${index + 1}: Email already exists - ${email}`);
          continue;
        }

        // Check if phone already exists
        const existingPhone = await Alumni.findOne({ where: { phone } });
        if (existingPhone) {
          errors.push(`Row ${index + 1}: Phone already exists - ${phone}`);
          continue;
        }

        // Generate password: name@4digits (e.g., john@1234)
        const randomDigits = generateRandomDigits();
        const password = `${name.split(" ")[0].toLowerCase()}@${randomDigits}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use transaction to ensure both records are created
        const transaction = await sequelize.transaction();

        try {
          // Create alumni record
          const alumni = await Alumni.create(
            {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              branch: branch.trim(),
              password: hashedPassword,
              userType: "alumni",
              isVerified: true,
            },
            { transaction }
          );

          // Create alumni profile with branch
          await AlumniProfile.create(
            {
              alumniId: alumni.id,
              branch: branch.trim(),
            },
            { transaction }
          );

          // Commit transaction
          await transaction.commit();

          successfulRegistrations.push({
            name: alumni.name,
            email: alumni.email,
            phone: alumni.phone,
            branch: alumni.branch,
            temporaryPassword: password,
          });

          // Comment out email service if not implemented
          emailService.sendWelcomeEmail(alumni).catch((error) => {
            console.error(
              `Failed to send welcome email to ${alumni.email}:`,
              error
            );
          });
        } catch (transactionError) {
          // Rollback transaction if any error occurs
          await transaction.rollback();
          errors.push(
            `Row ${index + 1}: Database error - ${transactionError.message}`
          );
        }
      } catch (error) {
        errors.push(`Row ${index + 1}: ${error.message}`);
      }
    }

    res.status(200).json({
      message: "Bulk registration completed",
      summary: {
        totalProcessed: results.length,
        successful: successfulRegistrations.length,
        failed: errors.length,
      },
      successfulRegistrations,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Bulk registration error:", error);
    res.status(500).json({
      message: "Server error during bulk registration",
      error: error.message,
    });
  }
};

export default BulkRegisterAlumni;
