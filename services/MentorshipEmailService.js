// services/MentorshipEmailService.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class MentorshipEmailService {
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

  // Send email when student requests mentorship
  async sendMentorshipRequestEmail(mentorEmail, studentEmail, requestData) {
    try {
      // Send to mentor
      await this.sendEmailToMentor(mentorEmail, requestData);

      // Send confirmation to student
      await this.sendRequestConfirmationToStudent(studentEmail, requestData);

      console.log(`✅ Mentorship request emails sent successfully`);
      return {
        success: true,
        message: "Mentorship request emails sent successfully",
      };
    } catch (error) {
      console.error(
        "❌ Failed to send mentorship request emails:",
        error.message
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Send email when mentorship status changes
  async sendStatusChangeEmail(mentorEmail, studentEmail, statusData) {
    try {
      // Send to both parties
      await this.sendStatusUpdateToMentor(mentorEmail, statusData);
      await this.sendStatusUpdateToStudent(studentEmail, statusData);

      console.log(`✅ Status change emails sent successfully`);
      return {
        success: true,
        message: "Status change emails sent successfully",
      };
    } catch (error) {
      console.error("❌ Failed to send status change emails:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Send email when mentorship details are updated
  async sendMentorshipUpdateEmail(mentorEmail, studentEmail, updateData) {
    try {
      // Send to both parties
      await this.sendUpdateNotificationToMentor(mentorEmail, updateData);
      await this.sendUpdateNotificationToStudent(studentEmail, updateData);

      console.log(`✅ Mentorship update emails sent successfully`);
      return {
        success: true,
        message: "Mentorship update emails sent successfully",
      };
    } catch (error) {
      console.error(
        "❌ Failed to send mentorship update emails:",
        error.message
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Private method to send email to mentor for new request
  async sendEmailToMentor(mentorEmail, requestData) {
    const mailOptions = {
      from: `"MITS ALumni Portal" <${process.env.GMAIL_USER}>`,
      to: mentorEmail,
      subject: `🎯 New Mentorship Request from ${requestData.studentName}`,
      html: this.generateMentorRequestTemplate(requestData),
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Request notification sent to mentor: ${mentorEmail}`);
  }

  // Private method to send confirmation to student
  async sendRequestConfirmationToStudent(studentEmail, requestData) {
    const mailOptions = {
      from: `"MITS Alumni Portal" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `📨 Mentorship Request Sent to ${requestData.mentorName}`,
      html: this.generateStudentRequestConfirmationTemplate(requestData),
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Request confirmation sent to student: ${studentEmail}`);
  }

  // Private method to send status update to mentor
  async sendStatusUpdateToMentor(mentorEmail, statusData) {
    const mailOptions = {
      from: `"MITS Alumni Portal" <${process.env.GMAIL_USER}>`,
      to: mentorEmail,
      subject: `🔄 Mentorship Request ${this.getStatusActionText(
        statusData.newStatus
      )}`,
      html: this.generateMentorStatusUpdateTemplate(statusData),
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Status update sent to mentor: ${mentorEmail}`);
  }

  // Private method to send status update to student
  async sendStatusUpdateToStudent(studentEmail, statusData) {
    const mailOptions = {
      from: `"MITS Alumni Portal" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `🔄 Mentorship Request ${this.getStatusActionText(
        statusData.newStatus
      )} by ${statusData.mentorName}`,
      html: this.generateStudentStatusUpdateTemplate(statusData),
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Status update sent to student: ${studentEmail}`);
  }

  // Private method to send update notification to mentor
  async sendUpdateNotificationToMentor(mentorEmail, updateData) {
    const mailOptions = {
      from: `"MITS Alumni Portal" <${process.env.GMAIL_USER}>`,
      to: mentorEmail,
      subject: `📝 Mentorship Session Updated`,
      html: this.generateMentorUpdateTemplate(updateData),
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Update notification sent to mentor: ${mentorEmail}`);
  }

  // Private method to send update notification to student
  async sendUpdateNotificationToStudent(studentEmail, updateData) {
    const mailOptions = {
      from: `"MITS Alumni Portal" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `📝 Mentorship Session Updated by ${updateData.mentorName}`,
      html: this.generateStudentUpdateTemplate(updateData),
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Update notification sent to student: ${studentEmail}`);
  }

  // Helper method to get status action text
  getStatusActionText(status) {
    const statusTexts = {
      pending: "Received",
      active: "Accepted",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return statusTexts[status] || status;
  }

  // Generate common header
  generateHeader(title, subtitle) {
    return `
      <div class="header">
        <div class="logo-container">
          <img src="https://web.mitsgwalior.in/images/mits-logo.png" alt="MITS Logo" class="logo">
        </div>
        <div class="college-name">Madhav Institute of Technology & Science</div>
        <div class="welcome-title">${title}</div>
        <div class="welcome-subtitle">${subtitle}</div>
      </div>
    `;
  }

  // Generate common footer
  generateFooter(userType = "Mentorship") {
    const userTypeText = `${userType} Portal`;
    return `
      <div class="footer">
        <div class="footer-text">MITS ${userTypeText}</div>
        <div class="footer-text">Madhav Institute of Technology & Science, Gwalior</div>
        <div class="footer-text">© ${new Date().getFullYear()} MITS Alumni Portal</div>
        <div class="footer-text">This is an automated notification message</div>
      </div>
    `;
  }

  // Template generators with exact same styling
  generateMentorRequestTemplate(requestData) {
    const {
      studentName,
      studentEmail,
      requestMessage,
      sessionDate,
      sessionTime,
      requestDate,
    } = requestData;

    const formattedRequestDate = new Date(requestDate).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Mentorship Request</title>
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
        .welcome-subtitle { color: rgba(255, 255, 255, 0.9); font-size: 16px; position: relative; z-index: 1; }

        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: #0d47a1; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }

        .details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .details-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }

        .message-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .message-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        .message-content { background: white; padding: 20px; border-radius: 8px; font-style: italic; color: #455a64; line-height: 1.6; }

        .action-section { background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border: 2px solid #ffa000; }
        .action-title { font-size: 16px; color: #ef6c00; margin-bottom: 12px; text-align: center; font-weight: 700; }
        .action-item { color: #5d4037; font-size: 13px; line-height: 1.5; margin-bottom: 8px; padding-left: 15px; position: relative; }
        .action-item::before { content: '•'; position: absolute; left: 0; color: #ef6c00; font-weight: bold; }

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
            .welcome-subtitle { font-size: 14px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${this.generateHeader(
          "New Mentorship Request",
          "You have received a new mentorship request"
        )}

        <div class="content">
            <div class="success-section">
                <div class="success-icon">🎯</div>
                <div class="greeting">New Mentorship Request!</div>
                <div class="success-text">A student has requested you as their mentor. Please review the request details below and respond accordingly.</div>
            </div>

            <div class="details-section">
                <div class="details-title">Student Information</div>
                <div class="detail-item">
                    <div class="detail-label">Student Name</div>
                    <div class="detail-value">${studentName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email Address</div>
                    <div class="detail-value">${studentEmail}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Request Date</div>
                    <div class="detail-value">${formattedRequestDate}</div>
                </div>
                ${
                  sessionDate
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Preferred Session Date</div>
                    <div class="detail-value">${new Date(
                      sessionDate
                    ).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</div>
                </div>
                `
                    : ""
                }
                ${
                  sessionTime
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Preferred Session Time</div>
                    <div class="detail-value">${sessionTime}</div>
                </div>
                `
                    : ""
                }
            </div>

            ${
              requestMessage
                ? `
            <div class="message-section">
                <div class="message-title">Student's Personal Message</div>
                <div class="message-content">"${requestMessage}"</div>
            </div>
            `
                : ""
            }

            <div class="action-section">
                <div class="action-title">📋 Action Required</div>
                <div class="action-item">Login to the MITS Alumni Portal to review this request</div>
                <div class="action-item">Accept or decline the request within 3 business days</div>
                <div class="action-item">Communicate any schedule changes to the student</div>
                <div class="action-item">Provide constructive feedback if declining the request</div>
            </div>

            <div class="help-section">
                <div class="help-title">❓ Need Assistance?</div>
                <div class="help-text">Contact our mentorship coordination team</div>
                <div class="help-text">Email: <a href="mailto:mentorship@mitsgwalior.in" class="contact-email">mentorship@mitsgwalior.in</a></div>
            </div>
        </div>

        ${this.generateFooter("Mentorship")}
    </div>
</body>
</html>
    `;
  }

  generateStudentRequestConfirmationTemplate(requestData) {
    const {
      mentorName,
      requestMessage,
      sessionDate,
      sessionTime,
      requestDate,
    } = requestData;

    const formattedRequestDate = new Date(requestDate).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentorship Request Confirmation</title>
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
        .welcome-subtitle { color: rgba(255, 255, 255, 0.9); font-size: 16px; position: relative; z-index: 1; }

        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: #0d47a1; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }

        .details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .details-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }

        .message-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .message-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        .message-content { background: white; padding: 20px; border-radius: 8px; font-style: italic; color: #455a64; line-height: 1.6; }

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
            .welcome-subtitle { font-size: 14px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${this.generateHeader(
          "Mentorship Request Sent",
          "Your request has been successfully submitted"
        )}

        <div class="content">
            <div class="success-section">
                <div class="success-icon">✅</div>
                <div class="greeting">Request Sent Successfully!</div>
                <div class="success-text">Your mentorship request has been sent to ${mentorName}. You will receive an email notification once they respond to your request.</div>
            </div>

            <div class="details-section">
                <div class="details-title">Request Details</div>
                <div class="detail-item">
                    <div class="detail-label">Mentor Name</div>
                    <div class="detail-value">${mentorName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Request Date</div>
                    <div class="detail-value">${formattedRequestDate}</div>
                </div>
                ${
                  sessionDate
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Preferred Session Date</div>
                    <div class="detail-value">${new Date(
                      sessionDate
                    ).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</div>
                </div>
                `
                    : ""
                }
                ${
                  sessionTime
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Preferred Session Time</div>
                    <div class="detail-value">${sessionTime}</div>
                </div>
                `
                    : ""
                }
            </div>

            ${
              requestMessage
                ? `
            <div class="message-section">
                <div class="message-title">Your Message to Mentor</div>
                <div class="message-content">"${requestMessage}"</div>
            </div>
            `
                : ""
            }

            <div class="instructions-section">
                <div class="instructions-title">📋 What Happens Next?</div>
                <div class="instruction-item">The mentor will review your request and respond within 3 business days</div>
                <div class="instruction-item">You will receive an email notification when the mentor responds</div>
                <div class="instruction-item">If accepted, you'll receive session confirmation details</div>
                <div class="instruction-item">Prepare any questions or topics you'd like to discuss</div>
                <div class="instruction-item">Keep your schedule flexible for the proposed session time</div>
            </div>

            <div class="help-section">
                <div class="help-title">❓ Need Assistance?</div>
                <div class="help-text">Contact our mentorship coordination team</div>
                <div class="help-text">Email: <a href="mailto:mentorship@mitsgwalior.in" class="contact-email">mentorship@mitsgwalior.in</a></div>
            </div>
        </div>

        ${this.generateFooter("Mentorship")}
    </div>
</body>
</html>
    `;
  }

  generateMentorStatusUpdateTemplate(statusData) {
    const {
      studentName,
      newStatus,
      oldStatus,
      mentorNotes,
      sessionDate,
      sessionTime,
    } = statusData;

    const statusColors = {
      active: "#4CAF50",
      cancelled: "#f44336",
      completed: "#2196F3",
    };

    const statusIcons = {
      active: "✅",
      cancelled: "❌",
      completed: "🎓",
    };

    const statusMessages = {
      active: "Mentorship Session Accepted",
      cancelled: "Mentorship Request Declined",
      completed: "Mentorship Session Completed",
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentorship Status Update</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a3a52; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 10px; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(25, 103, 210, 0.15); }

        .header { background: linear-gradient(135deg, ${
          statusColors[newStatus]
        } 0%, ${statusColors[newStatus]}dd 50%, ${
      statusColors[newStatus]
    }bb 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; z-index: 0; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -5%; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; z-index: 0; }
        .logo-container { margin-bottom: 20px; position: relative; z-index: 1; }
        .logo { width: 70px; height: 70px; border-radius: 12px; object-fit: contain; background: rgba(255, 255, 255, 0.15); padding: 8px; display: block; margin: 0 auto 15px auto; border: 2px solid rgba(255, 255, 255, 0.3); }
        .college-name { color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px; position: relative; z-index: 1; }
        .welcome-title { color: white; font-size: 22px; font-weight: 700; margin: 20px 0 10px 0; position: relative; z-index: 1; letter-spacing: 0.5px; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.9); font-size: 16px; position: relative; z-index: 1; }

        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: ${
          statusColors[newStatus]
        }; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }

        .details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .details-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }

        .status-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .status-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        .status-content { background: white; padding: 20px; border-radius: 8px; }
        .status-item { margin-bottom: 15px; }
        .status-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 5px; }
        .status-value { color: #455a64; }

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
            .welcome-subtitle { font-size: 14px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${this.generateHeader(
          statusMessages[newStatus],
          `You ${newStatus} a mentorship request`
        )}

        <div class="content">
            <div class="success-section">
                <div class="success-icon">${statusIcons[newStatus]}</div>
                <div class="greeting">Request ${this.getStatusActionText(
                  newStatus
                )}!</div>
                <div class="success-text">You have successfully ${newStatus} the mentorship request from ${studentName}. ${
      newStatus === "active"
        ? "The student has been notified and your session is confirmed."
        : "The student has been notified of your decision."
    }</div>
            </div>

            <div class="details-section">
                <div class="details-title">Student Information</div>
                <div class="detail-item">
                    <div class="detail-label">Student Name</div>
                    <div class="detail-value">${studentName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">New Status</div>
                    <div class="detail-value" style="text-transform: capitalize; font-weight: 600; color: ${
                      statusColors[newStatus]
                    };">${newStatus}</div>
                </div>
                ${
                  sessionDate
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Session Date</div>
                    <div class="detail-value">${new Date(
                      sessionDate
                    ).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</div>
                </div>
                `
                    : ""
                }
                ${
                  sessionTime
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Session Time</div>
                    <div class="detail-value">${sessionTime}</div>
                </div>
                `
                    : ""
                }
            </div>

            <div class="status-section">
                <div class="status-title">Status Update Details</div>
                <div class="status-content">
                    <div class="status-item">
                        <div class="status-label">Previous Status</div>
                        <div class="status-value" style="text-transform: capitalize;">${oldStatus}</div>
                    </div>
                    <div class="status-item">
                        <div class="status-label">New Status</div>
                        <div class="status-value" style="text-transform: capitalize; font-weight: 600; color: ${
                          statusColors[newStatus]
                        };">${newStatus}</div>
                    </div>
                    ${
                      mentorNotes
                        ? `
                    <div class="status-item">
                        <div class="status-label">Your Notes</div>
                        <div class="status-value">${mentorNotes}</div>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>

            <div class="help-section">
                <div class="help-title">❓ Need Assistance?</div>
                <div class="help-text">Contact our mentorship coordination team</div>
                <div class="help-text">Email: <a href="mailto:mentorship@mitsgwalior.in" class="contact-email">mentorship@mitsgwalior.in</a></div>
            </div>
        </div>

        ${this.generateFooter("Mentorship")}
    </div>
</body>
</html>
    `;
  }

  generateStudentStatusUpdateTemplate(statusData) {
    const {
      mentorName,
      newStatus,
      oldStatus,
      mentorNotes,
      sessionDate,
      sessionTime,
    } = statusData;

    const statusColors = {
      active: "#4CAF50",
      cancelled: "#f44336",
      completed: "#2196F3",
    };

    const statusIcons = {
      active: "✅",
      cancelled: "❌",
      completed: "🎓",
    };

    const statusMessages = {
      active: "Mentorship Request Accepted!",
      cancelled: "Mentorship Request Declined",
      completed: "Mentorship Session Completed",
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentorship Status Update</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a3a52; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 10px; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(25, 103, 210, 0.15); }

        .header { background: linear-gradient(135deg, ${
          statusColors[newStatus]
        } 0%, ${statusColors[newStatus]}dd 50%, ${
      statusColors[newStatus]
    }bb 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; z-index: 0; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -5%; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; z-index: 0; }
        .logo-container { margin-bottom: 20px; position: relative; z-index: 1; }
        .logo { width: 70px; height: 70px; border-radius: 12px; object-fit: contain; background: rgba(255, 255, 255, 0.15); padding: 8px; display: block; margin: 0 auto 15px auto; border: 2px solid rgba(255, 255, 255, 0.3); }
        .college-name { color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px; position: relative; z-index: 1; }
        .welcome-title { color: white; font-size: 22px; font-weight: 700; margin: 20px 0 10px 0; position: relative; z-index: 1; letter-spacing: 0.5px; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.9); font-size: 16px; position: relative; z-index: 1; }

        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: ${
          statusColors[newStatus]
        }; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }

        .details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .details-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }

        .status-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .status-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        .status-content { background: white; padding: 20px; border-radius: 8px; }
        .status-item { margin-bottom: 15px; }
        .status-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 5px; }
        .status-value { color: #455a64; }

        .next-steps-section { background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border: 2px solid #ffa000; }
        .next-steps-title { font-size: 16px; color: #ef6c00; margin-bottom: 12px; text-align: center; font-weight: 700; }
        .next-steps-item { color: #5d4037; font-size: 13px; line-height: 1.5; margin-bottom: 8px; padding-left: 15px; position: relative; }
        .next-steps-item::before { content: '•'; position: absolute; left: 0; color: #ef6c00; font-weight: bold; }

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
            .welcome-subtitle { font-size: 14px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${this.generateHeader(
          statusMessages[newStatus],
          `${mentorName} has ${newStatus} your request`
        )}

        <div class="content">
            <div class="success-section">
                <div class="success-icon">${statusIcons[newStatus]}</div>
                <div class="greeting">Request ${this.getStatusActionText(
                  newStatus
                )}!</div>
                <div class="success-text">${mentorName} has ${newStatus} your mentorship request. ${
      newStatus === "active"
        ? "Your mentorship session has been confirmed!"
        : "Thank you for your interest in mentorship."
    }</div>
            </div>

            <div class="details-section">
                <div class="details-title">Mentorship Details</div>
                <div class="detail-item">
                    <div class="detail-label">Mentor Name</div>
                    <div class="detail-value">${mentorName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Request Status</div>
                    <div class="detail-value" style="text-transform: capitalize; font-weight: 600; color: ${
                      statusColors[newStatus]
                    };">${newStatus}</div>
                </div>
                ${
                  sessionDate
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Session Date</div>
                    <div class="detail-value">${new Date(
                      sessionDate
                    ).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</div>
                </div>
                `
                    : ""
                }
                ${
                  sessionTime
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Session Time</div>
                    <div class="detail-value">${sessionTime}</div>
                </div>
                `
                    : ""
                }
            </div>

            <div class="status-section">
                <div class="status-title">Status Update Information</div>
                <div class="status-content">
                    <div class="status-item">
                        <div class="status-label">Previous Status</div>
                        <div class="status-value" style="text-transform: capitalize;">${oldStatus}</div>
                    </div>
                    <div class="status-item">
                        <div class="status-label">Current Status</div>
                        <div class="status-value" style="text-transform: capitalize; font-weight: 600; color: ${
                          statusColors[newStatus]
                        };">${newStatus}</div>
                    </div>
                    ${
                      mentorNotes
                        ? `
                    <div class="status-item">
                        <div class="status-label">Mentor's Message</div>
                        <div class="status-value">${mentorNotes}</div>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>

            ${
              newStatus === "active"
                ? `
            <div class="next-steps-section">
                <div class="next-steps-title">🎉 Next Steps - Session Confirmed!</div>
                <div class="next-steps-item">Prepare your questions and topics for discussion</div>
                <div class="next-steps-item">Join the session 5 minutes before the scheduled time</div>
                <div class="next-steps-item">Have your college ID ready for verification</div>
                <div class="next-steps-item">Take notes during the session for future reference</div>
                <div class="next-steps-item">Be respectful of the mentor's time and expertise</div>
            </div>
            `
                : newStatus === "cancelled"
                ? `
            <div class="next-steps-section">
                <div class="next-steps-title">💡 Alternative Options</div>
                <div class="next-steps-item">You can request mentorship from other available mentors</div>
                <div class="next-steps-item">Consider attending group mentorship sessions</div>
                <div class="next-steps-item">Explore our online resources and workshops</div>
                <div class="next-steps-item">Contact career counseling for additional guidance</div>
            </div>
            `
                : ""
            }

            <div class="help-section">
                <div class="help-title">❓ Need Assistance?</div>
                <div class="help-text">Contact our mentorship coordination team</div>
                <div class="help-text">Email: <a href="mailto:mentorship@mitsgwalior.in" class="contact-email">mentorship@mitsgwalior.in</a></div>
            </div>
        </div>

        ${this.generateFooter("Mentorship")}
    </div>
</body>
</html>
    `;
  }

  generateMentorUpdateTemplate(updateData) {
    const { studentName, updates, sessionDate, sessionTime } = updateData;

    const formattedSessionDate = sessionDate
      ? new Date(sessionDate).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentorship Session Updated</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a3a52; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 10px; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(25, 103, 210, 0.15); }

        .header { background: linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #EF6C00 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; z-index: 0; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -5%; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; z-index: 0; }
        .logo-container { margin-bottom: 20px; position: relative; z-index: 1; }
        .logo { width: 70px; height: 70px; border-radius: 12px; object-fit: contain; background: rgba(255, 255, 255, 0.15); padding: 8px; display: block; margin: 0 auto 15px auto; border: 2px solid rgba(255, 255, 255, 0.3); }
        .college-name { color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px; position: relative; z-index: 1; }
        .welcome-title { color: white; font-size: 22px; font-weight: 700; margin: 20px 0 10px 0; position: relative; z-index: 1; letter-spacing: 0.5px; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.9); font-size: 16px; position: relative; z-index: 1; }

        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: #F57C00; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }

        .details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .details-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }

        .update-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .update-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        .update-content { background: white; padding: 20px; border-radius: 8px; }
        .update-item { margin-bottom: 15px; }
        .update-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 5px; }
        .update-value { color: #455a64; }

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
            .welcome-subtitle { font-size: 14px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${this.generateHeader(
          "Mentorship Session Updated",
          "Session details have been modified"
        )}

        <div class="content">
            <div class="success-section">
                <div class="success-icon">📝</div>
                <div class="greeting">Session Details Updated!</div>
                <div class="success-text">Your mentorship session details have been successfully updated. The student has been notified of these changes.</div>
            </div>

            <div class="details-section">
                <div class="details-title">Updated Session Information</div>
                <div class="detail-item">
                    <div class="detail-label">Student Name</div>
                    <div class="detail-value">${studentName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Session Date</div>
                    <div class="detail-value">${formattedSessionDate}</div>
                </div>
                ${
                  sessionTime
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Session Time</div>
                    <div class="detail-value">${sessionTime}</div>
                </div>
                `
                    : ""
                }
            </div>

            <div class="update-section">
                <div class="update-title">Update Summary</div>
                <div class="update-content">
                    <div class="update-item">
                        <div class="update-label">Changes Made</div>
                        <div class="update-value">${
                          updates ||
                          "Session timing and details have been updated"
                        }</div>
                    </div>
                    <div class="update-item">
                        <div class="update-label">Notification Status</div>
                        <div class="update-value">Student has been notified of these changes via email</div>
                    </div>
                </div>
            </div>

            <div class="help-section">
                <div class="help-title">❓ Need Assistance?</div>
                <div class="help-text">Contact our mentorship coordination team</div>
                <div class="help-text">Email: <a href="mailto:mentorship@mitsgwalior.in" class="contact-email">mentorship@mitsgwalior.in</a></div>
            </div>
        </div>

        ${this.generateFooter("Mentorship")}
    </div>
</body>
</html>
    `;
  }

  generateStudentUpdateTemplate(updateData) {
    const { mentorName, updates, sessionDate, sessionTime } = updateData;

    const formattedSessionDate = sessionDate
      ? new Date(sessionDate).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentorship Session Updated</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a3a52; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 10px; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(25, 103, 210, 0.15); }

        .header { background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 50%, #6A1B9A 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; z-index: 0; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -5%; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; z-index: 0; }
        .logo-container { margin-bottom: 20px; position: relative; z-index: 1; }
        .logo { width: 70px; height: 70px; border-radius: 12px; object-fit: contain; background: rgba(255, 255, 255, 0.15); padding: 8px; display: block; margin: 0 auto 15px auto; border: 2px solid rgba(255, 255, 255, 0.3); }
        .college-name { color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px; position: relative; z-index: 1; }
        .welcome-title { color: white; font-size: 22px; font-weight: 700; margin: 20px 0 10px 0; position: relative; z-index: 1; letter-spacing: 0.5px; }
        .welcome-subtitle { color: rgba(255, 255, 255, 0.9); font-size: 16px; position: relative; z-index: 1; }

        .content { padding: 40px 25px; }
        .success-section { text-align: center; margin-bottom: 35px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 26px; color: #7B1FA2; margin-bottom: 15px; font-weight: 700; }
        .success-text { font-size: 15px; color: #455a64; line-height: 1.8; margin-bottom: 25px; }

        .details-section { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #4caf50; }
        .details-title { font-size: 20px; color: #2e7d32; margin-bottom: 20px; text-align: center; font-weight: 700; }
        .detail-item { background: white; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #4caf50; }
        .detail-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
        .detail-value { color: #455a64; font-size: 15px; display: block; font-weight: 500; }

        .update-section { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e1f5fe 100%); padding: 30px 25px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #1565c0; }
        .update-title { font-size: 18px; color: #0d47a1; margin-bottom: 22px; text-align: center; font-weight: 700; }
        .update-content { background: white; padding: 20px; border-radius: 8px; }
        .update-item { margin-bottom: 15px; }
        .update-label { font-weight: 700; color: #1565c0; display: block; margin-bottom: 5px; }
        .update-value { color: #455a64; }

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
            .welcome-subtitle { font-size: 14px; }
            .content { padding: 30px 15px; }
            .greeting { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${this.generateHeader(
          "Mentorship Session Updated",
          `${mentorName} has updated your session details`
        )}

        <div class="content">
            <div class="success-section">
                <div class="success-icon">✏️</div>
                <div class="greeting">Session Details Updated!</div>
                <div class="success-text">Your mentor ${mentorName} has updated your mentorship session details. Please review the updated information below.</div>
            </div>

            <div class="details-section">
                <div class="details-title">Updated Session Information</div>
                <div class="detail-item">
                    <div class="detail-label">Mentor Name</div>
                    <div class="detail-value">${mentorName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Session Date</div>
                    <div class="detail-value">${formattedSessionDate}</div>
                </div>
                ${
                  sessionTime
                    ? `
                <div class="detail-item">
                    <div class="detail-label">Session Time</div>
                    <div class="detail-value">${sessionTime}</div>
                </div>
                `
                    : ""
                }
            </div>

            <div class="update-section">
                <div class="update-title">Update Information</div>
                <div class="update-content">
                    <div class="update-item">
                        <div class="update-label">Changes Made</div>
                        <div class="update-value">${
                          updates ||
                          "Session timing and details have been updated by your mentor"
                        }</div>
                    </div>
                    <div class="update-item">
                        <div class="update-label">Updated By</div>
                        <div class="update-value">${mentorName} (Your Mentor)</div>
                    </div>
                    <div class="update-item">
                        <div class="update-label">Update Date</div>
                        <div class="update-value">${new Date().toLocaleDateString(
                          "en-IN",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}</div>
                    </div>
                </div>
            </div>

            <div class="instructions-section">
                <div class="instructions-title">📋 Important Notes</div>
                <div class="instruction-item">Please update your calendar with the new session details</div>
                <div class="instruction-item">Contact your mentor if you have any scheduling conflicts</div>
                <div class="instruction-item">Prepare your questions and topics in advance</div>
                <div class="instruction-item">Join the session 5 minutes before the scheduled time</div>
                <div class="instruction-item">Keep your college ID ready for verification</div>
            </div>

            <div class="help-section">
                <div class="help-title">❓ Need Assistance?</div>
                <div class="help-text">Contact our mentorship coordination team</div>
                <div class="help-text">Email: <a href="mailto:mentorship@mitsgwalior.in" class="contact-email">mentorship@mitsgwalior.in</a></div>
            </div>
        </div>

        ${this.generateFooter("Mentorship")}
    </div>
</body>
</html>
    `;
  }
}

export default MentorshipEmailService;
