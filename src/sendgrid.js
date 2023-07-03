const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

// Example email configuration
const msg = {
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Test Email',
  text: 'This is a test email sent using SendGrid',
};

// Send the email
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });

// Export the sgMail module
module.exports = sgMail;
