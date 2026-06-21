const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: 'customer' });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) {
            const exists = await User.findOne({ email, _id: { $ne: req.user.userId } });
            if (exists) return res.status(400).json({ message: 'Email already in use' });
            updates.email = email;
        }
        const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
