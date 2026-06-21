const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate CNIC' });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ success: true, message: 'Employee removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.generateCredentials = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        if (!employee.email) {
            return res.status(400).json({ message: 'Employee must have an email address first' });
        }

        const roleMap = {
            'Chief Veterinarian': 'veterinarian',
            'Veterinarian': 'veterinarian',
            'Manager': 'manager',
            'Supervisor': 'manager',
            'Analyst': 'accountant',
            'Soil Analyst': 'accountant',
            'Driver': 'worker',
            'Logistics Driver': 'worker',
            'Milker': 'worker',
            'Senior Milker': 'worker',
            'Worker': 'worker',
        };
        const userRole = roleMap[employee.role] || 'worker';

        let user = await User.findOne({ email: employee.email });
        const plainPassword = req.body?.password || `Agri${employee.cnic?.slice(-4) || '1234'}`;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        if (user) {
            user.password = hashedPassword;
            user.role = userRole;
            user.name = employee.name;
            await user.save();
        } else {
            user = new User({
                name: employee.name,
                email: employee.email,
                password: hashedPassword,
                role: userRole,
            });
            await user.save();
        }

        employee.userId = user._id;
        employee.hasLogin = true;
        await employee.save();

        res.json({
            success: true,
            data: {
                email: employee.email,
                password: plainPassword,
                role: userRole,
                message: 'Login credentials generated. Share with employee securely.'
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
