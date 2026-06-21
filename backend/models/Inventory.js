const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    unitPriceKPR: { type: Number, required: true },
    reorderLevel: { type: Number, required: true },
    expiryDate: Date,
    supplier: String,
    warehouseLocation: String,
    lastRestockedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
