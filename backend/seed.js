const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const Animal = require('./models/Animal');
const Inventory = require('./models/Inventory');
const User = require('./models/User');
const Employee = require('./models/Employee');
const FinancialRecord = require('./models/FinancialRecord');
const HealthRecord = require('./models/HealthRecord');
const Order = require('./models/Order');
const Product = require('./models/Product');
const BreedingRecord = require('./models/BreedingRecord');
const Task = require('./models/Task');
const AnimalGroup = require('./models/AnimalGroup');

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        await Promise.all([
            Animal.deleteMany({}),
            Inventory.deleteMany({}),
            User.deleteMany({}),
            Employee.deleteMany({}),
            FinancialRecord.deleteMany({}),
            HealthRecord.deleteMany({}),
            Order.deleteMany({}),
            Product.deleteMany({}),
            BreedingRecord.deleteMany({}),
            Task.deleteMany({}),
            AnimalGroup.deleteMany({})
        ]);

        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash('admin123', salt);
        const adminUser = await User.create({
            name: 'Ahmed Sheikh',
            email: 'admin@agriprime.com',
            password: hashedAdminPassword,
            role: 'admin'
        });
        console.log('Admin user seeded successfully.');

        const hashedCustomerPassword = await bcrypt.hash('password', salt);
        const customerUser = await User.create({
            name: 'John Customer',
            email: 'customer@agriprime.com',
            password: hashedCustomerPassword,
            role: 'customer'
        });
        console.log('Customer user seeded successfully.');

        const animals = [
            { rfid: 'RF-9921-A', name: 'Bessie 04', species: 'Cattle', breed: 'Black Angus', gender: 'Female', weightKg: 580, status: 'Healthy' },
            { rfid: 'RF-1054-B', name: 'Titan', species: 'Cattle', breed: 'Hereford', gender: 'Male', weightKg: 840, status: 'Quarantine' },
            { rfid: 'RF-4423-S', name: 'Cloud 09', species: 'Sheep', breed: 'Merino', gender: 'Female', weightKg: 65, status: 'Sold' },
            { rfid: 'RF-8831-F', name: 'Moo-ry', species: 'Cattle', breed: 'Holstein', gender: 'Female', weightKg: 610, status: 'Healthy' },
            { rfid: 'RF-2201-C', name: 'Daisy', species: 'Cattle', breed: 'Jersey', gender: 'Female', weightKg: 490, status: 'Healthy' }
        ];
        const createdAnimals = await Animal.insertMany(animals);
        console.log('Animals seeded!');

        const inventory = [
            { itemName: 'Organic Mix', category: 'Feed', quantityKg: 12000, unitPriceKPR: 80, reorderLevel: 2000 },
            { itemName: 'Corn Shells', category: 'Feed', quantityKg: 3200, unitPriceKPR: 60, reorderLevel: 4000 },
            { itemName: 'Wheat Grain', category: 'Feed', quantityKg: 28500, unitPriceKPR: 90, reorderLevel: 5000 },
            { itemName: 'Premium Hay', category: 'Feed', quantityKg: 450, unitPriceKPR: 120, reorderLevel: 1000 },
            { itemName: 'Ivermectin', category: 'Medicine', quantityKg: 50, unitPriceKPR: 2500, reorderLevel: 10 }
        ];
        await Inventory.insertMany(inventory);
        console.log('Inventory seeded!');

        const employees = [
            { name: 'Fatima Malik', cnic: '11111', email: 'fatima.malik@agriprime.com', role: 'Chief Veterinarian', department: 'Veterinary', phone: '555-0101', salaryPKR: 150000, status: 'Active' },
            { name: 'Usman Ahmed', cnic: '22222', email: 'usman.ahmed@agriprime.com', role: 'Senior Milker', department: 'Livestock', phone: '555-0192', salaryPKR: 45000, status: 'On Leave' },
            { name: 'Tariq Hassan', cnic: '33333', email: 'tariq.hassan@agriprime.com', role: 'Logistics Driver', department: 'Logistics', phone: '555-0233', salaryPKR: 50000, status: 'Active' },
            { name: 'Sara Khan', cnic: '44444', email: 'sara.khan@agriprime.com', role: 'Soil Analyst', department: 'Agronomy', phone: '555-0422', salaryPKR: 120000, status: 'Active' }
        ];
        await Employee.insertMany(employees);
        console.log('Employees seeded!');

        const healthRecords = [
            {
                animalId: createdAnimals[1]._id,
                date: new Date(),
                recordType: 'Treatment',
                diagnosis: 'Foot Rot',
                treatment: 'Antibiotics & Footbath',
                veterinarian: adminUser._id,
                status: 'Under Treatment'
            },
            {
                animalId: createdAnimals[0]._id,
                date: new Date(),
                recordType: 'Vaccination',
                diagnosis: 'Annual FMD Vaccination',
                treatment: 'FMD Vaccine administered',
                veterinarian: adminUser._id,
                status: 'Completed',
                followUpDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            },
            {
                animalId: createdAnimals[3]._id,
                date: new Date(),
                recordType: 'Checkup',
                diagnosis: 'Routine health check',
                treatment: 'Vitamin supplement',
                veterinarian: adminUser._id,
                status: 'Under Treatment'
            }
        ];
        await HealthRecord.insertMany(healthRecords);
        console.log('Health Records seeded!');

        const breedingRecords = [
            {
                animalId: createdAnimals[0]._id,
                partnerAnimalId: createdAnimals[1]._id,
                heatDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                breedingDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
                expectedBirthDate: new Date(Date.now() + 255 * 24 * 60 * 60 * 1000),
                status: 'Pregnant',
                notes: 'First breeding cycle - Black Angus x Hereford'
            },
            {
                animalId: createdAnimals[3]._id,
                heatDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'Heat Alert',
                notes: 'Monitor for heat signs'
            },
            {
                animalId: createdAnimals[4]._id,
                partnerAnimalId: createdAnimals[1]._id,
                breedingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                expectedBirthDate: new Date(Date.now() + 220 * 24 * 60 * 60 * 1000),
                status: 'Pregnant',
                notes: 'Jersey breeding program'
            }
        ];
        await BreedingRecord.insertMany(breedingRecords);
        console.log('Breeding Records seeded!');

        const products = [
            {
                name: 'Fresh Organic Milk (1L)',
                description: 'Farm-fresh, non-homogenized milk from pasture-raised Holstein cattle.',
                category: 'Dairy',
                price: 350,
                stock: 200,
                sku: 'DAIRY-001',
                imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                tags: ['organic', 'grass-fed']
            },
            {
                name: 'Artisan Farm Cheese (500g)',
                description: 'Handcrafted aged cheese from our Jersey cows.',
                category: 'Dairy',
                price: 1200,
                stock: 45,
                sku: 'DAIRY-002',
                imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                tags: ['organic', 'artisan']
            },
            {
                name: 'Black Angus Heifer',
                description: 'Premium Black Angus heifer, 18 months, fully vaccinated and health certified.',
                category: 'Livestock',
                price: 450000,
                stock: 3,
                sku: 'LIVE-001',
                imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                relatedAnimalId: createdAnimals[0]._id,
                tags: ['heritage-breed', 'certified']
            },
            {
                name: 'Organic Feed Mix (25kg)',
                description: 'GMO-free organic feed blend for dairy cattle.',
                category: 'Feed',
                price: 2800,
                stock: 150,
                sku: 'FEED-001',
                imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                tags: ['organic', 'GMO-free']
            },
            {
                name: 'Premium Wheat Grain (50kg)',
                description: 'High-quality wheat grain for livestock feed.',
                category: 'Feed',
                price: 4500,
                stock: 80,
                sku: 'FEED-002',
                imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
                certified: false,
                inStock: true
            },
            {
                name: 'Merino Ewe',
                description: 'Healthy Merino ewe, excellent wool quality, 2 years old.',
                category: 'Livestock',
                price: 85000,
                stock: 2,
                sku: 'LIVE-002',
                imageUrl: 'https://images.unsplash.com/photo-1484557985045-edf968e73a64?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                tags: ['heritage-breed']
            },
            {
                name: 'Farm Fresh Eggs (30 pack)',
                description: 'Free-range eggs from our pasture-raised hens.',
                category: 'Organic',
                price: 600,
                stock: 100,
                sku: 'ORG-001',
                imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                tags: ['organic', 'free-range']
            },
            {
                name: 'Raw Honey (500g)',
                description: 'Pure raw honey from our farm apiaries.',
                category: 'Organic',
                price: 950,
                stock: 60,
                sku: 'ORG-002',
                imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
                certified: true,
                inStock: true,
                tags: ['organic', 'raw']
            }
        ];
        await Product.insertMany(products);
        console.log('Products seeded!');

        const financials = [
            { type: 'Income', category: 'Milk Sales', description: 'Monthly Dairy Output', amountPKR: 450000, date: new Date() },
            { type: 'Expense', category: 'Feed', description: 'Bulk order of Wheat Grain', amountPKR: 120000, date: new Date() },
            { type: 'Income', category: 'Livestock Sales', description: 'Merino sheep sale', amountPKR: 85000, date: new Date() },
            { type: 'Expense', category: 'Veterinary', description: 'Vaccination supplies', amountPKR: 15000, date: new Date() }
        ];
        await FinancialRecord.insertMany(financials);
        console.log('Financial Records seeded!');

        const orders = [
            {
                orderNumber: 'ORD-001',
                customer: { name: 'Ali Traders', email: 'ali@traders.com', phone: '0300-1234567' },
                items: [{ productName: 'Organic Feed Mix (25kg)', qty: 10, unitPriceKPR: 2800 }],
                totalAmountPKR: 28000,
                status: 'Processing',
                paymentMethod: 'Bank Transfer',
                paymentStatus: 'Paid'
            },
            {
                orderNumber: 'ORD-002',
                customer: { name: 'Fresh Dairy Co', email: 'orders@freshdairy.com', phone: '0300-9876543' },
                items: [{ productName: 'Fresh Organic Milk (1L)', qty: 50, unitPriceKPR: 350 }],
                totalAmountPKR: 17500,
                status: 'Delivered',
                paymentMethod: 'Cash',
                paymentStatus: 'Paid'
            },
            {
                orderNumber: 'ORD-003',
                customer: { name: customerUser.name, email: customerUser.email, phone: '0300-5551234' },
                items: [{ productName: 'Artisan Farm Cheese (500g)', qty: 2, unitPriceKPR: 1200 }],
                totalAmountPKR: 2400,
                status: 'Shipped',
                paymentMethod: 'Mobile Wallet',
                paymentStatus: 'Paid'
            }
        ];
        await Order.insertMany(orders);
        console.log('Orders seeded!');

        const createdEmployees = await Employee.find();
        if (createdEmployees.length >= 2) {
            await Task.insertMany([
                { title: 'Morning Milking - Barn 4', description: 'Complete morning milking session', status: 'In Progress', priority: 'High', assignedTo: createdEmployees[1]._id, progress: 50, dueDate: new Date() },
                { title: 'Vaccination - Herd A', description: 'Annual FMD vaccination for cattle herd', status: 'To Do', priority: 'High', assignedTo: createdEmployees[0]._id, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
                { title: 'Fence Repair West Side', description: 'Repair damaged fence section', status: 'To Do', priority: 'Medium', assignedTo: createdEmployees[2]._id },
                { title: 'Feed Delivery Check', description: 'Verify incoming feed shipment', status: 'Done', priority: 'Low', assignedTo: createdEmployees[2]._id, progress: 100, completedAt: new Date() },
            ]);
            console.log('Tasks seeded!');
        }

        const feedItem = await Inventory.findOne({ itemName: 'Organic Mix' });
        await AnimalGroup.insertMany([
            { name: 'Dairy Herd A', description: 'High yielding dairy cows', species: 'Cow', feedItemId: feedItem?._id, feedItemName: 'Organic Mix', dailyFeedKg: 450, animalCount: 25 },
            { name: 'Goat Pen', description: 'Young goat group', species: 'Goat', feedItemName: 'Premium Hay', dailyFeedKg: 85, animalCount: 12 },
        ]);
        console.log('Animal Groups seeded!');

        console.log('\n✅ Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
