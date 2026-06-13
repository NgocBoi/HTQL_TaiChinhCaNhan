import User from '../models/User.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import { ApiError } from '../utils/ApiError.js';

const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const findUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

const ensureNotLastActiveAdmin = async (user, nextIsActive, nextRole) => {
  const willRemainAdmin =
    (nextRole ?? user.role) === 'admin' && (nextIsActive ?? user.isActive);

  if (user.role === 'admin' && !willRemainAdmin) {
    const activeAdminCount = await User.countDocuments({
      role: 'admin',
      isActive: true,
      _id: { $ne: user._id },
    });

    if (activeAdminCount < 1) {
      throw new ApiError(400, 'Cannot remove or deactivate the last active admin');
    }
  }
};

export const getAllUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users.map(formatUser);
};

export const getUserById = async (userId) => {
  const user = await findUserById(userId);
  return formatUser(user);
};

export const createUser = async ({
  name,
  email,
  password,
  role = 'user',
  isActive = true,
}) => {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(400, 'Email already registered');
  }

  const user = await User.create({
    name: name.trim(),
    email,
    password,
    role,
    isActive,
  });

  return formatUser(user);
};

export const updateUser = async (adminId, targetUserId, updates) => {
  const user = await User.findById(targetUserId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const nextRole = updates.role ?? user.role;
  const nextIsActive = updates.isActive ?? user.isActive;

  if (adminId === targetUserId) {
    if (updates.role !== undefined && updates.role !== 'admin') {
      throw new ApiError(400, 'Cannot change your own role');
    }
    if (updates.isActive === false) {
      throw new ApiError(400, 'Cannot deactivate your own account');
    }
  }

  await ensureNotLastActiveAdmin(user, nextIsActive, nextRole);

  if (updates.name !== undefined) {
    user.name = updates.name.trim();
  }

  if (updates.email !== undefined && updates.email !== user.email) {
    const duplicate = await User.findOne({
      email: updates.email,
      _id: { $ne: user._id },
    });

    if (duplicate) {
      throw new ApiError(400, 'Email already in use');
    }

    user.email = updates.email;
  }

  if (updates.role !== undefined) {
    user.role = updates.role;
  }

  if (updates.isActive !== undefined) {
    user.isActive = updates.isActive;
  }

  if (updates.password) {
    user.password = updates.password;
  }

  await user.save();

  return formatUser(user);
};

export const updateUserStatus = async (adminId, targetUserId, isActive) => {
  return updateUser(adminId, targetUserId, { isActive });
};

export const deleteUser = async (adminId, targetUserId) => {
  if (adminId === targetUserId) {
    throw new ApiError(400, 'Cannot delete your own account');
  }

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });

    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot delete the last admin account');
    }
  }

  await Transaction.deleteMany({ user: targetUserId });
  await Category.deleteMany({ user: targetUserId });
  await user.deleteOne();

  return { id: targetUserId };
};

export const getAdminDashboard = async () => {
  const [totalUsers, activeUsers, inactiveUsers, totalTransactions] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Transaction.countDocuments(),
    ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalTransactions,
  };
};
