const { sendEmail } = require('../services/emailService');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Mock success without sending email
        res.status(200).json({ success: true, message: 'Thanks for subscribing!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
