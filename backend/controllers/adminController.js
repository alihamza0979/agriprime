const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Animal = require('../models/Animal');
const Order = require('../models/Order');
const Product = require('../models/Product');
const FinancialRecord = require('../models/FinancialRecord');
const Employee = require('../models/Employee');

exports.getDashboardStats = async (req, res) => {
    try {
        const [users, animals, orders, products, financialRecords, employees] = await Promise.all([
            User.countDocuments(),
            Animal.countDocuments(),
            Order.find().sort({ createdAt: -1 }),
            Product.countDocuments(),
            FinancialRecord.find(),
            Employee.countDocuments({ status: 'Active' })
        ]);

        let revenue = 0;
        let expenses = 0;
        financialRecords.forEach(r => {
            if (r.type === 'Income') revenue += r.amountPKR;
            else if (r.type === 'Expense') expenses += r.amountPKR;
        });

        const orderRevenue = orders.reduce((sum, o) => sum + (o.totalAmountPKR || 0), 0);

        res.json({
            success: true,
            data: {
                totalUsers: users,
                totalAnimals: animals,
                totalOrders: orders.length,
                totalProducts: products,
                activeEmployees: employees,
                totalRevenue: revenue + orderRevenue,
                netProfit: revenue - expenses,
                recentOrders: orders.slice(0, 5)
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role && req.user.userId !== req.params.id) updates.role = role;

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.userId === req.params.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const hashed = await bcrypt.hash(password || 'password123', 10);
        const allowedRoles = ['admin', 'manager', 'veterinarian', 'worker', 'accountant', 'customer'];
        const user = await User.create({
            name,
            email,
            password: hashed,
            role: allowedRoles.includes(role) ? role : 'customer'
        });

        const safe = user.toObject();
        delete safe.password;
        res.status(201).json({ success: true, data: safe });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
