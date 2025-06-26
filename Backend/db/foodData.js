const Product = require('../models/product');
const data = require('./data');

const seedProducts = async () => {
    try {
        await Product.deleteMany(); // Clear existing data
        await Product.insertMany(data); // Insert new data
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = { seedProducts };