const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to use IPv4 for DNS resolution. 
// This fixes the 'ENETUNREACH 2607:f8b0:...' error on Render containers
// that don't have outbound IPv6 routing enabled.
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Force IPv4 directly at the socket level
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured. Skipping email send to:', to);
        return null;
    }
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail
};
