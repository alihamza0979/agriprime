const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.certified) filter.certified = req.query.certified === 'true';
        if (req.query.inStock) filter.inStock = req.query.inStock === 'true';
        
        const products = await Product.find(filter)
            .populate('relatedAnimalId', 'rfid name')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('relatedAnimalId');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Product name or SKU already exists' });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, message: 'Product removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Search query required' });
        
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        }).limit(20);
        
        res.json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
