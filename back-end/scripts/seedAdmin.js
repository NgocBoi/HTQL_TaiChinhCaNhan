import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = process.env.ADMIN_EMAIL || 'admin@pfm.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = process.env.ADMIN_NAME || 'System Admin';

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    existing.isActive = true;
    if (password) existing.password = password;
    await existing.save();
    console.log(`Admin updated: ${email}`);
  } else {
    await User.create({ name, email, password, role: 'admin', isActive: true });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
