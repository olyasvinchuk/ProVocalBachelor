import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import User from './models/userModel.js';
import Category from './models/categoryModel.js';
import Training from './models/trainingModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data if necessary
    await User.deleteMany();
    await Training.deleteMany();
    await Category.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);

    // Log the created users for verification
    // console.log('Created Users:', createdUsers);

    // Use the first user as admin
    const adminUser = createdUsers[0]._id;

    // Ensure collections exist
    await Category.createCollection();
    await Training.createCollection();

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error('Error Details:', error);

    if (error.writeErrors) {
      console.error('Write Errors:', error.writeErrors);
    }

    if (error.result && error.result.result) {
      console.error('Result:', error.result.result);
    }

    console.error(`${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    // await Training.deleteMany();
    // await Category.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
