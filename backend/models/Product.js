const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    category: { type: String, required: true }, // 'Dairy', 'Livestock', 'Feed', 'Organic', etc.
    price: { type: Number, required: true },
    currency: { type: String, default: 'PKR' },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true },
    imageUrl: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: Number,
    certified: { type: Boolean, default: false }, // Agrezen certified
    inStock: { type: Boolean, default: true },
    relatedAnimalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
    tags: [String], // 'organic', 'grass-fed', 'heritage-breed', etc.
    vendorInfo: {
        vendorName: String,
        vendorEmail: String,
        vendorPhone: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
