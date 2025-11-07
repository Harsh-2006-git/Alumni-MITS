// services/EmailService.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

dotenv.config();

class EmailService {
  constructor() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error("Email service configuration missing");
    }

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async generateQRCode(data) {
    try {
      const qrData = JSON.stringify({
        registrationId: data.registrationId,
        eventId: data.eventId,
        userName: data.name,
        userEmail: data.email,
        eventName: data.eventName,
        eventDate: data.eventDate,
        userType: data.userType,
        timestamp: new Date().toISOString(),
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1565c0",
          light: "#ffffff",
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error("❌ Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  }

  async sendEventRegistrationEmail(registrationData) {
    try {
      if (!registrationData || !registrationData.email) {
        throw new Error("Registration data with email is required");
      }

      // Generate QR code
      const qrCodeDataURL = await this.generateQRCode(registrationData);

      const mailOptions = {
        from: `"MITS Alumni Portal" <${process.env.GMAIL_USER}>`,
        to: registrationData.email,
        subject: `🎉 Successfully Registered for ${registrationData.eventName}`,
        html: this.generateEventRegistrationTemplate(
          registrationData,
          qrCodeDataURL
        ),
        attachments: [
          {
            filename: "event-qr-code.png",
            path: qrCodeDataURL,
            cid: "qrcode@mits.event",
          },
        ],
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(
        `✅ Event registration email sent to ${registrationData.email}`
      );
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error(
        `❌ Failed to send event registration email:`,
        error.message
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  generateEventRegistrationTemplate(registrationData, qrCodeDataURL) {
    const {
      name,
      eventName,
      eventDate,
      eventTime,
      eventLocation,
      eventDescription,
      registrationId,
      registrationDate,
      userType,
    } = registrationData;

    const userTypeText = userType === "alumni" ? "Alumni" : "Student";

    const formattedEventDate = new Date(eventDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedRegistrationDate = new Date(
      registrationDate
    ).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Registration Confirmation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a3a52; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 10px; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(25, 103, 210, 0.15); }
        
        .header { background: linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; z-index: 0; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -5%; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; z-index: 0; }
        .logo-container { margin-bottom: 20px; position: relative; z-index: 1; }
        .logo { width: 70px; height: 70px; border-radius: 12px; object-fit: contain; background: rgba(255, 255, 255, 0.15); padding: 8px; display: block; margin: 0 auto 15px auto; border: 2px solid rgba(255, 255, 255, 0.3); }
        .college-name { color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px; position: relative; z-index: 1; }
        .welcome-title { color: white; font-size: 22px; font-weight: 700; margin: 20px 0 10px 0; position: relative; z-index: 1; letter-spacing: 0.5px; }
        
        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: #0d47a1; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }
        
        .qr-section { background: linear-gradient(135deg, #e1f5fe 0%, #f3e5f5 100%); padding: 30px 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #42a5f5; text-align: center; }
        .qr-title { font-size: 20px; color: #1565c0; margin-bottom: 20px; font-weight: 700; }
        .qr-container { background: white; padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(21, 101, 192, 0.2); }
        .qr-code { width: 200px; height: 200px; border-radius: 8px; }
        .qr-instructions { text-align: left; max-width: 400px; margin: 0 auto; }
        .qr-instruction { color: #455a64; font-size: 13px; line-height: 1.5; margin-bottom: 8px; padding-left: 15px; position: relative; }
        .qr-instruction::before { content: '•'; position: absolute; left: 0; color: #1565c0; font-weight: bold; }
        
        .event-details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .event-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }
        
        .registration-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .registration-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        
        .instructions-section { background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border: 2px solid #ffa000; }
        .instructions-title { font-size: 16px; color: #ef6c00; margin-bottom: 12px; text-align: center; font-weight: 700; }
        .instruction-item { color: #5d4037; font-size: 13px; line-height: 1.5; margin-bottom: 8px; padding-left: 15px; position: relative; }
        .instruction-item::before { content: '•'; position: absolute; left: 0; color: #ef6c00; font-weight: bold; }
        
        .help-section { text-align: center; padding: 28px 25px; background: linear-gradient(135deg, #e1f5fe 0%, #f3e5f5 100%); border-radius: 12px; margin: 30px 0; border-top: 3px solid #42a5f5; }
        .help-title { font-size: 17px; color: #0d47a1; margin-bottom: 12px; font-weight: 700; }
        .help-text { color: #455a64; font-size: 14px; margin-bottom: 10px; font-weight: 500; }
        .contact-email { color: #1565c0; font-weight: 700; text-decoration: none; border-bottom: 2px solid #1565c0; }
        
        .footer { background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%); color: white; padding: 28px 20px; text-align: center; }
        .footer-text { font-size: 12px; line-height: 1.7; opacity: 0.9; margin-bottom: 6px; font-weight: 500; }
        .footer-text:last-child { margin-bottom: 0; opacity: 0.7; font-size: 11px; }
        
        @media (max-width: 480px) {
            body { padding: 5px; }
            .header { padding: 30px 15px; }
            .logo { width: 60px; height: 60px; }
            .college-name { font-size: 16px; }
            .welcome-title { font-size: 20px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
            .qr-code { width: 180px; height: 180px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <img src="https://web.mitsgwalior.in/images/mits-logo.png" alt="MITS Logo" class="logo">
            </div>
            <div class="college-name">Madhav Institute of Technology & Science</div>
            <div class="welcome-title">Event Registration Confirmation</div>
        </div>
        
        <div class="content">
            <div class="success-section">
                <div class="success-icon">🎉</div>
                <div class="greeting">Registration Successful, ${name}!</div>
                <div class="success-text">You have successfully registered for the event. We're excited to have you join us!</div>
            </div>

            <div class="qr-section">
                <div class="qr-title">📱 Digital Entry Pass</div>
                <div class="qr-container">
                    <img src="cid:qrcode@mits.event" alt="Event QR Code" class="qr-code">
                </div>
                <div class="qr-instructions">
                    <div class="qr-instruction">• Show this QR code at the entrance for quick check-in</div>
                    <div class="qr-instruction">• Keep this email handy for verification</div>
                    <div class="qr-instruction">• QR contains your registration details</div>
                </div>
            </div>

            <div class="event-details-section">
                <div class="event-title">${eventName}</div>
                <div class="detail-item">
                    <div class="detail-label">Event Date</div>
                    <div class="detail-value">${formattedEventDate}</div>
                </div>
                ${
                  eventTime
                    ? `<div class="detail-item"><div class="detail-label">Event Time</div><div class="detail-value">${eventTime}</div></div>`
                    : ""
                }
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${eventLocation}</div>
                </div>
                ${
                  eventDescription
                    ? `<div class="detail-item"><div class="detail-label">Description</div><div class="detail-value">${eventDescription}</div></div>`
                    : ""
                }
            </div>
            
            <div class="registration-section">
                <div class="registration-title">Registration Details</div>
                <div class="detail-item">
                    <div class="detail-label">Registration ID</div>
                    <div class="detail-value">${registrationId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Registered Email</div>
                    <div class="detail-value">${registrationData.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">User Type</div>
                    <div class="detail-value">${userTypeText}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Registration Date</div>
                    <div class="detail-value">${formattedRegistrationDate}</div>
                </div>
            </div>
            
            <div class="instructions-section">
                <div class="instructions-title">📋 Important Instructions</div>
                <div class="instruction-item">Please save this confirmation email for your records</div>
                <div class="instruction-item">Show the QR code at the entrance for quick check-in</div>
                <div class="instruction-item">Arrive at the venue 15 minutes before the event starts</div>
                <div class="instruction-item">Bring your college ID card for verification</div>
                <div class="instruction-item">Check your email for any updates about the event</div>
                ${
                  eventLocation.toLowerCase().includes("online")
                    ? `<div class="instruction-item">Join the online meeting 5 minutes before the scheduled time</div>`
                    : ""
                }
            </div>
            
            <div class="help-section">
                <div class="help-title">❓ Need Help?</div>
                <div class="help-text">Contact our event coordination team</div>
                <div class="help-text">Email: <a href="mailto:events@mitsgwalior.in" class="contact-email">events@mitsgwalior.in</a></div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">MITS ${userTypeText} Association</div>
            <div class="footer-text">Madhav Institute of Technology & Science, Gwalior</div>
            <div class="footer-text">© ${new Date().getFullYear()} MITS Alumni Portal</div>
            <div class="footer-text">This is an automated confirmation message</div>
        </div>
    </div>
</body>
</html>
    `;
  }
}

export default EmailService;
