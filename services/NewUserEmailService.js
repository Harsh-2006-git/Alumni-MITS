import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "harshmanmode79@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "dqmh ltkr zedo oafp",
      },
    });
  }

  async sendWelcomeEmail(user) {
    try {
      const subject =
        user.userType === "alumni"
          ? "🎓 Welcome to MITS Alumni Portal!"
          : "🎉 Welcome to MITS Student Portal!";

      const mailOptions = {
        from: `"MITS Alumni Portal" <${
          process.env.GMAIL_USER || "harshmanmode79@gmail.com"
        }>`,
        to: user.email,
        subject: subject,
        html: this.generateWelcomeTemplate(user),
        text: this.generateWelcomeText(user),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${user.email} (${user.userType})`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(
        `❌ Failed to send welcome email to ${user.email}:`,
        error.message
      );
      return { success: false, error: error.message };
    }
  }

  generateWelcomeTemplate(user) {
    const isAlumni = user.userType === "alumni";
    const userTypeText = isAlumni ? "Alumni" : "Student";

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
        
        .cta-button:hover {
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
            margin-bottom: 6px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            color: #455a64;
            font-size: 15px;
            display: block;
            font-weight: 500;
        }
        
        .status-pending {
            color: #f57c00;
            font-weight: 700;
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
            align-items: center;
            gap: 12px;
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
            color: #1565c0;
            font-size: 20px;
        }
        
        .feature-text {
            color: #455a64;
            font-size: 14px;
            line-height: 1.6;
            font-weight: 500;
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
                gap: 10px;
            }
            
            .feature-icon {
                width: 20px;
                height: 20px;
                font-size: 18px;
                margin-right: 17px;
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
            <div class="welcome-title">Welcome to MITS ${userTypeText} Portal</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Welcome Message -->
            <div class="welcome-section">
                <div class="greeting">
                    Welcome, ${user.name || userTypeText}! 
                    <span class="user-badge">${userTypeText}</span>
                </div>
                <div class="welcome-text">
                    We're thrilled to welcome you to the MITS ${userTypeText} community. 
                </div>
                <a href="${
                  process.env.FRONTEND_URL || "https://alumni-mits.vercel.app"
                }" class="cta-button">
                    Explore Your Dashboard
                </a>
            </div>
            
            <!-- Account Details -->
            <div class="details-section">
                <div class="details-title">Your Account Details</div>
                
                <div class="detail-item">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${
                      user.name || "Not provided"
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
                
                ${
                  user.branch
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Branch</div>
                    <div class="detail-value">${user.branch}</div>
                </div>
                `
                    : ""
                }
                
                ${
                  isAlumni && !user.isVerified
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value status-pending">Under Verification</div>
                </div>
                `
                    : ""
                }
                
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
            <div class="footer-text">MITS Alumni Association</div>
            <div class="footer-text">Madhav Institute of Technology & Science, Gwalior</div>
            <div class="footer-text">© ${new Date().getFullYear()} MITS Alumni Portal</div>
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

    return `
WELCOME TO MITS ${userTypeText.toUpperCase()} PORTAL
===========================================

Dear ${user.name || userTypeText},

We're thrilled to welcome you to the MITS ${userTypeText} community. 
Your journey with us is just beginning, and we're excited to see you 
connect, grow, and succeed with your fellow MITSians.

YOUR ACCOUNT DETAILS:
---------------------
Name: ${user.name || "Not provided"}

Email: ${user.email}

User Type: ${userTypeText}

${user.branch ? `Branch: ${user.branch}\n` : ""}\
${isAlumni && !user.isVerified ? "Status: Under Verification\n" : ""}\
Registration Date: ${new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}

GET STARTED:
------------
Access your dashboard: ${
      process.env.FRONTEND_URL || "https://alumni-mits.vercel.app"
    }

NEED HELP?
----------
Contact our support team: support@mitsgwalior.in

Best regards,

MITS Alumni Association
Madhav Institute of Technology & Science
Gwalior
===========================================
This is an automated message
    `;
  }
}

export default EmailService;
