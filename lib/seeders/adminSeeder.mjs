import mongoose from 'mongoose';
import connectDB from '@/db.js';
import User from '@/models/user.js';

async function seedAdmin() {
  try {
    await connectDB();

    const adminData = {
      email: 'admin@example.com',
      username: 'admin',
      role: 'admin',
      status: 'ACTIVE',
      verified: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create(adminData);
    console.log('Admin user created successfully:', admin);

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

export default seedAdmin; 