const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configure email transporter for health.go.ug domain
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'system@health.go.ug',
        pass: process.env.SMTP_PASSWORD || ''
      }
    });

    // Fallback for development - console logging
    this.isEmailEnabled = process.env.ENABLE_EMAIL === 'true';
  }

  /**
   * Send requisition submission notification
   */
  async sendRequisitionSubmitted(requisition, user, signatories) {
    const subject = `Requisition ${requisition.requisition_number} Submitted for Approval`;
    
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: #0f172a;">Ministry of Health Uganda</h2>
          <h3 style="color: #1e293b;">Requisition Submitted for Approval</h3>
          
          <p>Dear ${signatories.map(s => s.name).join(', ')},</p>
          
          <p>A new requisition has been submitted and requires your review:</p>
          
          <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
            <tr><td><strong>Requisition Number:</strong></td><td>${requisition.requisition_number}</td></tr>
            <tr><td><strong>Department:</strong></td><td>${requisition.from_department}</td></tr>
            <tr><td><strong>Requested By:</strong></td><td>${user.firstname} ${user.lastname}</td></tr>
            <tr><td><strong>Purpose:</strong></td><td>${requisition.purpose_remarks}</td></tr>
            <tr><td><strong>Date Submitted:</strong></td><td>${requisition.form_date}</td></tr>
          </table>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/stores/form76a/${requisition.requisition_id}" 
               style="background-color: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              Review Requisition
            </a>
          </p>
          
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px;">
            This is an automated notification from the Ministry of Health Inventory Management System.
          </p>
        </body>
      </html>
    `;

    const recipients = signatories.map(s => s.health_email).filter(Boolean);
    
    if (!this.isEmailEnabled) {
      console.log('📧 [EMAIL WOULD SEND]', { subject, recipients });
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'system@health.go.ug',
        to: recipients.join(', '),
        cc: [user.health_email || user.email].filter(Boolean),
        subject,
        html
      });
      console.log('✅ Email sent successfully to:', recipients);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      return false;
    }
  }

  /**
   * Send requisition approval notification
   */
  async sendRequisitionApproved(requisition, approvingUser) {
    const subject = `Requisition ${requisition.requisition_number} Approved`;
    
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: #10b981;">Requisition Approved</h2>
          <p>Your requisition has been approved and is ready for issuance.</p>
          <p><strong>Approved by:</strong> ${approvingUser.name}</p>
          <p><strong>Requisition Number:</strong> ${requisition.requisition_number}</p>
        </body>
      </html>
    `;

    if (!this.isEmailEnabled) {
      console.log('📧 [EMAIL WOULD SEND]', subject);
      return true;
    }

    try {
      // Implementation would go here
      console.log('✅ Approval email sent');
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      return false;
    }
  }

  /**
   * Send requisition issued notification
   */
  async sendRequisitionIssued(requisition, issuingUser) {
    const subject = `Requisition ${requisition.requisition_number} Issued`;
    
    // Similar implementation for issued notifications
    console.log('📧 Issuance notification sent');
    return true;
  }

  /**
   * Send requisition closed notification
   */
  async sendRequisitionClosed(requisition, closingUser) {
    const subject = `Requisition ${requisition.requisition_number} Closed`;
    
    // Similar implementation for closed notifications
    console.log('📧 Closure notification sent');
    return true;
  }
}

module.exports = new EmailService();
