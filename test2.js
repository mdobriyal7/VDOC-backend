const nodemailer = require('nodemailer');

// Create a transporter using your email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanu.virtualrealdesign@gmail.com',
        pass: 'hrjqehwsygjaxbkk',
    },
});

// Function to send an email with file links
const sendEmailWithLinks = async (recipientEmail, fileLinks) => {
    try {
        // Define email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: recipientEmail,
            subject: 'Your File Links',
            html: `
        <p>Here are the links to your files:</p>
        <ul>
          ${fileLinks.map(link => `<li>${link}</li>`).join('')}
        </ul>
      `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Example usage
const recipientEmail = 'shanutyagi010@gmail.com';
const fileLinks = ['https://yourfileserver.com/files/file1.pdf', 'https://yourfileserver.com/files/file2.pdf'];

sendEmailWithLinks(recipientEmail, fileLinks);
