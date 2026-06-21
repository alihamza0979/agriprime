const { sendEmail } = require('../services/emailService');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Try sending a welcome email (in the background)
        const html = `
            <h3>Welcome to the AgriPrime Community!</h3>
            <p>Hi there,</p>
            <p>Thank you for subscribing to our newsletter! You'll now receive exclusive offers, farming tips, and early access to new products.</p>
            <br/><p>Best regards,<br/>AgriPrime Team</p>
        `;
        sendEmail(email, 'Welcome to AgriPrime Newsletter!', html)
            .catch(emailErr => console.error('Failed to send newsletter welcome email:', emailErr));

        res.status(200).json({ success: true, message: 'Thanks for subscribing!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
