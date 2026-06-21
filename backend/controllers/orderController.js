const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

const isAdminRole = (role) => ['admin', 'manager', 'accountant'].includes(role);

exports.getAllOrders = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        if (!isAdminRole(req.user.role)) {
            const user = await User.findById(req.user.userId);
            if (user?.email) {
                filter['customer.email'] = user.email;
            }
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!isAdminRole(req.user.role)) {
            const user = await User.findById(req.user.userId);
            if (order.customer?.email !== user?.email) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const payload = { ...req.body };

        if (!isAdminRole(req.user.role)) {
            const user = await User.findById(req.user.userId);
            payload.customer = {
                ...payload.customer,
                name: payload.customer?.name || user.name,
                email: user.email,
            };
            payload.status = 'Pending';
            payload.paymentStatus = payload.paymentStatus || 'Pending';
        }

        const order = new Order(payload);
        await order.save();

        // Try sending confirmation email (in the background)
        if (payload.customer?.email) {
            const html = `
                <h3>Order Confirmation #${order.orderNumber}</h3>
                <p>Hi ${payload.customer.name},</p>
                <p>Thank you for your order! We've received it and will start processing it soon.</p>
                <p><strong>Total Amount:</strong> ₨${order.totalAmountPKR || order.totalAmount || 0}</p>
                <p>You can track your order in your dashboard.</p>
                <br/><p>Best regards,<br/>AgriPrime Team</p>
            `;
            sendEmail(payload.customer.email, `Order Confirmation #${order.orderNumber}`, html)
                .catch(emailErr => console.error('Failed to send order email:', emailErr));
        }

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate Order Number' });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        if (!isAdminRole(req.user.role)) {
            return res.status(403).json({ message: 'Only admins can update orders' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        if (!isAdminRole(req.user.role)) {
            return res.status(403).json({ message: 'Only admins can delete orders' });
        }

        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ success: true, message: 'Order removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
