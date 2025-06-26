import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from '../models/Admin.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
    });

    await admin.save();
    console.log('Admin user created successfully.');
    process.exit();
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
