const AnimalGroup = require('../models/AnimalGroup');
const Inventory = require('../models/Inventory');

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await AnimalGroup.find().populate('feedItemId', 'itemName quantityKg unitPriceKPR').sort({ createdAt: -1 });
        res.json({ success: true, count: groups.length, data: groups });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const group = new AnimalGroup(req.body);
        await group.save();
        res.status(201).json({ success: true, data: group });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const group = await AnimalGroup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json({ success: true, data: group });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = await AnimalGroup.findByIdAndDelete(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json({ success: true, message: 'Group removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.autoAdjustFeed = async (req, res) => {
    try {
        const groups = await AnimalGroup.find();
        const adjustments = [];

        for (const group of groups) {
            if (!group.feedItemId || !group.dailyFeedKg) continue;
            const inventory = await Inventory.findById(group.feedItemId);
            if (!inventory) continue;

            const needed = group.dailyFeedKg;
            const available = inventory.quantityKg;
            if (available < needed * 7) {
                adjustments.push({
                    group: group.name,
                    feedItem: inventory.itemName,
                    currentStock: available,
                    dailyNeed: needed,
                    recommendation: `Reorder ${inventory.itemName} — only ${available}kg left (${Math.floor(available / needed)} days supply)`
                });
            }
        }

        res.json({ success: true, data: adjustments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.generateReport = async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ category: 1 });
        const groups = await AnimalGroup.find();
        const lowStock = inventory.filter(i => i.quantityKg <= i.reorderLevel);
        const expiring = inventory.filter(i => i.expiryDate && new Date(i.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

        res.json({
            success: true,
            data: {
                generatedAt: new Date(),
                totalItems: inventory.length,
                totalStockKg: inventory.reduce((s, i) => s + i.quantityKg, 0),
                lowStockItems: lowStock,
                expiringItems: expiring,
                animalGroups: groups,
                inventory
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
