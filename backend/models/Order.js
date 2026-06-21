const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    qty: { type: Number, required: true },
    unitPriceKPR: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customer: {
        name: { type: String, required: true },
        email: String,
        phone: String,
        city: String
    },
    items: [orderItemSchema],
    totalAmountPKR: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    deliveryAddress: String,
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
