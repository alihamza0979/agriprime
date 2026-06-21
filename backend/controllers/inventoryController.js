const Inventory = require('../models/Inventory');

exports.getAllInventory = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        const inventory = await Inventory.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: inventory.length, data: inventory });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getInventoryById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createInventory = async (req, res) => {
    try {
        const item = new Inventory(req.body);
        await item.save();
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateInventory = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ success: true, message: 'Item removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
