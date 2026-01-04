import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class EmailService {
    constructor() {
        // Validate required environment variables
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            throw new Error(
                "Email service configuration missing: GMAIL_USER and GMAIL_APP_PASSWORD are required"
            );
        }

        this.transporter = nodemailer.createTransport({
            // Primary configuration
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use TLS
            requireTLS: true,
            auth: {
                user: process.env.GMAIL_USER1,
                pass: process.env.GMAIL_APP_PASSWORD1,
            },
            // Connection settings to prevent timeouts
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            socketTimeout: 60000, // 60 seconds
            connectionTimeout: 60000, // 60 seconds
            greetingTimeout: 30000, // 30 seconds
            dnsTimeout: 30000, // 30 seconds
            dns: {
                servers: ["8.8.8.8", "1.1.1.1", "8.8.4.4"],
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Verify connection on startup
        this.verifyConnection();
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log("✅ Email server connection verified and ready");
            return true;
        } catch (error) {
            console.error("❌ Email server connection failed:", error.message);
            return false;
        }
    }

    async testEmailService() {
        try {
            console.log("🧪 Testing email configuration...");
            console.log("📧 Using email:", process.env.GMAIL_USER1);

            // First verify connection
            const isConnected = await this.verifyConnection();
            if (!isConnected) {
                throw new Error("Cannot establish connection to email server");
            }

            // Send test email to yourself
            const testResult = await this.transporter.sendMail({
                from: `"MITS Test" <${process.env.GMAIL_USER1}>`,
                to: process.env.GMAIL_USER1,
                subject: "✅ MITS Portal - Email Service Test",
                text: "This is a test email from your MITS Alumni Portal application. If you received this, your email service is working correctly!",
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1565c0;">✅ MITS Portal - Email Service Test</h2>
            <p>This is a test email from your MITS Alumni Portal application.</p>
            <p>If you received this, your email service is working correctly!</p>
            <hr>
            <p><small>Sent at: ${new Date().toString()}</small></p>
          </div>
        `,
            });

            console.log("✅ Test email sent successfully:", testResult.messageId);
            return { success: true, messageId: testResult.messageId };
        } catch (error) {
            console.error("❌ Email test failed:", error.message);
            return { success: false, error: error.message };
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async sendWelcomeEmail(user) {
        try {
            // Validate input
            if (!user || !user.email) {
                throw new Error("User object with email is required");
            }

            if (!this.isValidEmail(user.email)) {
                throw new Error(`Invalid email format: ${user.email}`);
            }

            // Determine subject based on verification status
            const isVerified = user.isVerified || user.isVerified === undefined;
            const userTypeText = user.userType === "alumni" ? "Alumni" : "Student";

            const subject = isVerified
                ? `🎓 Welcome to MITS ${userTypeText} Portal - Your Account is Ready!`
                : `⏳ MITS ${userTypeText} Portal - Account Under Verification`;

            const mailOptions = {
                from: `"MITS ${userTypeText} Portal" <${process.env.GMAIL_USER1}>`,
                to: user.email,
                subject: subject,
                html: this.generateWelcomeTemplate(user),
                text: this.generateWelcomeText(user),
                // Add delivery options
                priority: "high",
                headers: {
                    "X-Priority": "1",
                    "X-MSMail-Priority": "High",
                    Importance: "high",
                },
            };

            console.log(`🔄 Attempting to send welcome email to ${user.email}...`);
            console.log(
                `📝 Status: ${isVerified ? "Verified" : "Under Verification"}`
            );

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `✅ Welcome email sent to ${user.email} (${user.userType}) - Status: ${isVerified ? "Verified" : "Pending"
                } - Message ID: ${result.messageId}`
            );
            return {
                success: true,
                messageId: result.messageId,
                response: result.response,
            };
        } catch (error) {
            console.error(
                `❌ Failed to send welcome email to ${user.email}:`,
                error.message
            );

            // Enhanced error handling with specific suggestions
            let errorDetails = error.message;

            if (error.code === "EAUTH") {
                errorDetails =
                    "Authentication failed - Please check your Gmail credentials and app password";
            } else if (error.code === "ECONNECTION") {
                errorDetails =
                    "Connection failed - Please check your internet connection and SMTP settings";
            } else if (error.code === "ETIMEDOUT") {
                errorDetails =
                    "Connection timed out - Please try again or check firewall settings";
            } else if (error.code === "ESOCKET") {
                errorDetails =
                    "Socket error - Network issue or port 587 might be blocked";
            } else if (error.code === "EMESSAGE") {
                errorDetails =
                    "Message rejected - Please check email content and recipient address";
            }

            return {
                success: false,
                error: errorDetails,
                code: error.code,
                originalError: error.message,
            };
        }
    }

    generateWelcomeTemplate(user) {
        const isAlumni = user.userType === "alumni";
        const userTypeText = isAlumni ? "Alumni" : "Student";
        const isVerified = user.isVerified || user.isVerified === undefined;

        // Generate features based on user type
        const features = isAlumni
            ? [
                { icon: "🤝", text: "Connect with students and fellow alumni" },
                { icon: "💼", text: "Share job opportunities and career guidance" },
                { icon: "🎯", text: "Participate in alumni events and mentorship" },
                {
                    icon: "📊",
                    text: "Access exclusive alumni resources and networks",
                },
            ]
            : [
                { icon: "🤝", text: "Connect with alumni for career guidance" },
                { icon: "📚", text: "Access learning resources and study materials" },
                { icon: "💼", text: "Find internship and job opportunities" },
                { icon: "🎓", text: "Participate in campus events and workshops" },
            ];

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MITS</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1a3a52;
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
            -webkit-font-smoothing: antialiased;
            padding: 10px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(25, 103, 210, 0.15);
        }

        /* Header Section */
        .header {
            background: linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%);
            padding: 40px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            z-index: 0;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -5%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            z-index: 0;
        }

        .logo-container {
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .logo {
            width: 70px;
            height: 70px;
            border-radius: 12px;
            object-fit: contain;
            background: rgba(255, 255, 255, 0.15);
            padding: 8px;
            display: block;
            margin: 0 auto 15px auto;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
        }

        .college-name {
            color: white;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
            position: relative;
            z-index: 1;
        }

        .welcome-title {
            color: white;
            font-size: 22px;
            font-weight: 700;
            margin: 20px 0 10px 0;
            position: relative;
            z-index: 1;
            letter-spacing: 0.5px;
        }

        /* Content Section */
        .content {
            padding: 40px 25px;
        }

        .welcome-section {
            text-align: center;
            margin-bottom: 35px;
        }

        .greeting {
            font-size: 26px;
            color: #0d47a1;
            margin-bottom: 15px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }

        .user-badge {
            background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            display: inline-block;
            margin-left: 10px;
            box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .welcome-text {
            font-size: 15px;
            color: #455a64;
            line-height: 1.8;
            margin-bottom: 25px;
        }

        /* Status Banner */
        .status-banner {
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
        }

        .status-verified {
            background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
            color: #2e7d32;
            border: 2px solid #4caf50;
        }

        .status-pending {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            color: #ef6c00;
            border: 2px solid #ff9800;
        }

        /* Credentials Section */
        .credentials-section {
            background: linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border: 2px solid #7e57c2;
        }

        .credentials-title {
            font-size: 20px;
            color: #5e35b1;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
        }

        .credential-item {
            background: white;
            padding: 15px;
            margin-bottom: 12px;
            border-radius: 8px;
            border-left: 4px solid #7e57c2;
        }

        .credential-label {
            font-weight: 700;
            color: #1565c0;
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .credential-value {
            color: #455a64;
            font-size: 15px;
            display: block;
            font-weight: 500;
            word-break: break-all;
        }

        .password-warning {
            background: #ffebee;
            color: #c62828;
            padding: 12px;
            border-radius: 8px;
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid #ffcdd2;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 15px;
            margin: 15px 0;
            box-shadow: 0 6px 20px rgba(13, 71, 161, 0.35);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-button:disabled {
            background: #9e9e9e;
            cursor: not-allowed;
            box-shadow: none;
        }

        .cta-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(13, 71, 161, 0.45);
        }

        /* Details Section */
        .details-section {
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%);
            padding: 30px 25px;
            border-radius: 12px;
            margin: 30px 0;
            border-left: 5px solid #1565c0;
            position: relative;
        }

        .details-section::before {
            content: '';
            position: absolute;
            top: -15px;
            right: -15px;
            width: 150px;
            height: 150px;
            background: rgba(21, 101, 192, 0.08);
            border-radius: 50%;
            z-index: 0;
        }

        .details-title {
            font-size: 18px;
            color: #0d47a1;
            margin-bottom: 22px;
            text-align: center;
            font-weight: 700;
            letter-spacing: 0.3px;
            position: relative;
            z-index: 1;
        }

        .detail-item {
            margin-bottom: 18px;
            padding-bottom: 18px;
            border-bottom: 2px solid rgba(21, 101, 192, 0.1);
            position: relative;
            z-index: 1;
        }

        .detail-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        .detail-label {
            font-weight: 700;
            color: #1565c0;
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-value {
            color: #455a64;
            font-size: 15px;
            display: block;
            font-weight: 500;
            word-break: break-all;
        }

        .status-value {
            font-weight: 700;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            display: inline-block;
        }

        .status-verified-badge {
            background: #4caf50;
            color: white;
        }

        .status-pending-badge {
            background: #ff9800;
            color: white;
        }

        /* Features Section */
        .features-section {
            margin: 35px 0;
        }

        .features-title {
            font-size: 18px;
            color: #0d47a1;
            margin-bottom: 22px;
            text-align: center;
            font-weight: 700;
            letter-spacing: 0.3px;
        }

        .feature-item {
            background: linear-gradient(135deg, rgba(21, 101, 192, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%);
            padding: 16px 20px;
            margin-bottom: 12px;
            border-radius: 10px;
            border-left: 4px solid #1565c0;
            display: flex;
            align-items: flex-start;
            gap: 15px;
            transition: all 0.3s ease;
        }

        .feature-item:hover {
            background: linear-gradient(135deg, rgba(21, 101, 192, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%);
            transform: translateX(5px);
        }

        .feature-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            font-size: 20px;
            margin-top: 2px;
        }

        .feature-text {
            color: #455a64;
            font-size: 14px;
            line-height: 1.6;
            font-weight: 500;
            flex: 1;
        }

        /* Verification Info Section */
        .verification-info {
            background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            border: 2px solid #ffa000;
        }

        .verification-title {
            font-size: 16px;
            color: #ef6c00;
            margin-bottom: 12px;
            text-align: center;
            font-weight: 700;
        }

        .verification-text {
            color: #5d4037;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 8px;
        }

        /* Help Section */
        .help-section {
            text-align: center;
            padding: 28px 25px;
            background: linear-gradient(135deg, #e1f5fe 0%, #f3e5f5 100%);
            border-radius: 12px;
            margin: 30px 0;
            border-top: 3px solid #42a5f5;
        }

        .help-title {
            font-size: 17px;
            color: #0d47a1;
            margin-bottom: 12px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }

        .help-text {
            color: #455a64;
            font-size: 14px;
            margin-bottom: 10px;
            font-weight: 500;
        }

        .contact-email {
            color: #1565c0;
            font-weight: 700;
            text-decoration: none;
            border-bottom: 2px solid #1565c0;
            transition: all 0.2s;
        }

        .contact-email:hover {
            color: #0d47a1;
            border-bottom-color: #0d47a1;
        }

        /* Footer */
        .footer {
            background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
            color: white;
            padding: 28px 20px;
            text-align: center;
        }

        .footer-text {
            font-size: 12px;
            line-height: 1.7;
            opacity: 0.9;
            margin-bottom: 6px;
            font-weight: 500;
        }

        .footer-text:last-child {
            margin-bottom: 0;
            opacity: 0.7;
            font-size: 11px;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            body {
                padding: 5px;
            }

            .header {
                padding: 30px 15px;
            }

            .logo {
                width: 60px;
                height: 60px;
            }

            .college-name {
                font-size: 16px;
            }

            .welcome-title {
                font-size: 20px;
            }

            .content {
                padding: 30px 15px;
            }

            .greeting {
                font-size: 24px;
            }

            .welcome-text {
                font-size: 14px;
            }

            .cta-button {
                padding: 13px 30px;
                font-size: 14px;
            }

            .details-section {
                padding: 22px 15px;
            }

            .feature-item {
                padding: 14px 15px;
                gap: 12px;
            }

            .feature-icon {
                width: 20px;
                height: 20px;
                font-size: 18px;
                margin-right: 15px;
            }

            .credentials-section {
                padding: 20px 15px;
            }

            .verification-info {
                padding: 18px 15px;
            }

            .verification-text {
                font-size: 12px;
            }
        }

        @media (max-width: 360px) {
            .header {
                padding: 25px 12px;
            }

            .content {
                padding: 25px 12px;
            }

            .greeting {
                font-size: 22px;
            }

            .details-section {
                padding: 20px 12px;
            }

            .feature-item {
                padding: 12px 10px;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo-container">
                <img src="https://web.mitsgwalior.in/images/mits-logo.png" alt="MITS Logo" class="logo">
            </div>
            <div class="college-name">Madhav Institute of Technology & Science</div>
            <div class="welcome-title">Welcome to MITS ${userTypeText} Portal</div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <!-- Status Banner -->
            <div class="status-banner ${isVerified ? "status-verified" : "status-pending"
            }">
                ${isVerified
                ? "✅ Your Account is Verified & Active!"
                : "⏳ Your Account is Under Verification"
            }
            </div>

            <!-- Welcome Message -->
            <div class="welcome-section">
                <div class="greeting">
                    Welcome, ${user.name || userTypeText}!
                    <span class="user-badge">${userTypeText}</span>
                </div>
                <div class="welcome-text">
                    ${isVerified
                ? `We're thrilled to welcome you to the MITS ${userTypeText} community. Your account has been verified and is ready to use!`
                : `Thank you for registering with the MITS ${userTypeText} Portal. Your account is currently under verification.`
            }
                </div>
            </div>

            <!-- Credentials Section -->
            ${user.temporaryPassword
                ? `
            <div class="credentials-section">
                <div class="credentials-title">🔐 Your Login Credentials</div>

                <div class="credential-item">
                    <div class="credential-label">Email Address</div>
                    <div class="credential-value">${user.email}</div>
                </div>

                <div class="credential-item">
                    <div class="credential-label">Temporary Password</div>
                    <div class="credential-value">${user.temporaryPassword}</div>
                </div>

                <div class="password-warning">
                    ⚠️ Please change your password after first login for security
                </div>
            </div>
            `
                : ""
            }

            <!-- Login CTA -->
            <div style="text-align: center;">
                <a href="https://alumni-mits.vercel.app"
                   class="cta-button"
                   ${!isVerified
                ? 'style="background: #9e9e9e; cursor: not-allowed; box-shadow: none;" onclick="return false;"'
                : ""
            }>
                    ${isVerified
                ? "🚀 Login to Your Account"
                : "⏳ Account Under Verification"
            }
                </a>
            </div>

            <!-- Verification Info for Non-Verified Users -->
            ${!isVerified
                ? `
            <div class="verification-info">
                <div class="verification-title">📋 Verification Process</div>
                <div class="verification-text">
                    • Your account details are being reviewed by our team
                </div>
                <div class="verification-text">
                    • This process usually takes 24-48 hours
                </div>
                <div class="verification-text">
                    • You'll receive another email once verified
                </div>
                <div class="verification-text">
                    • Contact support if you have any questions
                </div>
            </div>
            `
                : ""
            }

            <!-- Account Details -->
            <div class="details-section">
                <div class="details-title">Your Account Details</div>

                <div class="detail-item">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${user.name || "Not provided"
            }</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${user.email}</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">User Type</div>
                    <div class="detail-value">${userTypeText}</div>
                </div>

                ${user.branch
                ? `
                <div class="detail-item">
                    <div class="detail-label">Branch</div>
                    <div class="detail-value">${user.branch}</div>
                </div>
                `
                : ""
            }

                ${user.batchYear
                ? `
                <div class="detail-item">
                    <div class="detail-label">Batch Year</div>
                    <div class="detail-value">${user.batchYear}</div>
                </div>
                `
                : ""
            }

                ${user.location
                ? `
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${user.location}</div>
                </div>
                `
                : ""
            }

                ${user.linkedinUrl
                ? `
                <div class="detail-item">
                    <div class="detail-label">LinkedIn Profile</div>
                    <div class="detail-value">
                        <a href="${user.linkedinUrl}" target="_blank" style="color: #1565c0; text-decoration: none;">
                            ${user.linkedinUrl}
                        </a>
                    </div>
                </div>
                `
                : ""
            }

                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="status-value ${isVerified
                ? "status-verified-badge"
                : "status-pending-badge"
            }">
                            ${isVerified
                ? "Verified & Active"
                : "Under Verification"
            }
                        </span>
                    </div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Registration Date</div>
                    <div class="detail-value">${new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            )}</div>
                </div>
            </div>

            <!-- Features -->
            <div class="features-section">
                <div class="features-title">What You Can Do</div>

                ${features
                .map(
                    (feature) => `
                <div class="feature-item">
                    <span class="feature-icon">${feature.icon}</span>
                    <div class="feature-text">${feature.text}</div>
                </div>
                `
                )
                .join("")}
            </div>

            <!-- Help Section -->
            <div class="help-section">
                <div class="help-title">❓ Need Help?</div>
                <div class="help-text">Our support team is here to assist you</div>
                <div class="help-text">
                    Email: <a href="mailto:support@mitsgwalior.in" class="contact-email">support@mitsgwalior.in</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">MITS ${userTypeText} Association</div>
            <div class="footer-text">Madhav Institute of Technology & Science, Gwalior</div>
            <div class="footer-text">© ${new Date().getFullYear()} MITS ${userTypeText} Portal</div>
            <div class="footer-text">This is an automated message</div>
        </div>
    </div>
</body>
</html>
    `;
    }

    generateWelcomeText(user) {
        const isAlumni = user.userType === "alumni";
        const userTypeText = isAlumni ? "Alumni" : "Student";
        const isVerified = user.isVerified || user.isVerified === undefined;

        return `
${isVerified
                ? "WELCOME TO MITS " + userTypeText.toUpperCase() + " PORTAL"
                : "MITS " +
                userTypeText.toUpperCase() +
                " PORTAL - ACCOUNT UNDER VERIFICATION"
            }
${"=".repeat(60)}

Dear ${user.name || userTypeText},

${isVerified
                ? `We're thrilled to welcome you to the MITS ${userTypeText} community. Your account has been verified and is ready to use!`
                : `Thank you for registering with the MITS ${userTypeText} Portal. Your account is currently under verification.`
            }

${user.temporaryPassword
                ? `
🔐 YOUR LOGIN CREDENTIALS:
${"-".repeat(30)}
Email: ${user.email}
Temporary Password: ${user.temporaryPassword}

⚠️ SECURITY NOTE: Please change your password after first login for security.
`
                : ""
            }

${isVerified
                ? `
🚀 GET STARTED:
${"-".repeat(30)}
Login URL: ${process.env.FRONTEND_URL || "https://alumni-mits.vercel.app"}
`
                : `
📋 VERIFICATION PROCESS:
${"-".repeat(30)}
• Your account details are being reviewed by our team
• This process usually takes 24-48 hours
• You'll receive another email once verified
• Contact support if you have any questions
`
            }

📋 YOUR ACCOUNT DETAILS:
${"-".repeat(30)}
Name: ${user.name || "Not provided"}
Email: ${user.email}
User Type: ${userTypeText}
${user.branch ? `Branch: ${user.branch}\n` : ""}\
${user.batchYear ? `Batch Year: ${user.batchYear}\n` : ""}\
${user.location ? `Location: ${user.location}\n` : ""}\
${user.linkedinUrl ? `LinkedIn: ${user.linkedinUrl}\n` : ""}\
Status: ${isVerified ? "Verified & Active" : "Under Verification"}
Registration Date: ${new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })}

🌟 WHAT YOU CAN DO:
${"-".repeat(30)}
${isAlumni
                ? `• Connect with students and fellow alumni
• Share job opportunities and career guidance
• Participate in alumni events and mentorship
• Access exclusive alumni resources and networks`
                : `• Connect with alumni for career guidance
• Access learning resources and study materials
• Find internship and job opportunities
• Participate in campus events and workshops`
            }

❓ NEED HELP?
${"-".repeat(30)}
Contact our support team: support@mitsgwalior.in

Best regards,

MITS ${userTypeText} Association
Madhav Institute of Technology & Science
Gwalior
${"=".repeat(60)}
This is an automated message
    `;
    }

    // Utility method to close the transporter
    async close() {
        if (this.transporter) {
            this.transporter.close();
            console.log("📧 Email transporter closed");
        }
    }
}

export default EmailService;