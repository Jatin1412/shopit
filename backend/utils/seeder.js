import Product from '../models/product.js';
import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';

import products from '../data/data.js';

// Setting dotenv file
dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();

export const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(products);
        console.log('All Products are added.');

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts();