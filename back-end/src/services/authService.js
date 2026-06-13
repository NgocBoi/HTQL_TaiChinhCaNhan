import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/jwt.js';

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
  });

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: formatUserResponse(user),
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: formatUserResponse(user),
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return formatUserResponse(user);
};

export const updateUserProfile = async (
  userId,
  { name, email, currentPassword, newPassword }
) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name !== undefined) {
    user.name = name.trim();
  }

  if (email !== undefined && email !== user.email) {
    const existing = await User.findOne({ email, _id: { $ne: userId } });

    if (existing) {
      throw new ApiError(400, 'Email already in use');
    }

    user.email = email;
  }

  if (newPassword) {
    const isValid = await user.comparePassword(currentPassword);

    if (!isValid) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    user.password = newPassword;
  }

  await user.save();

  return formatUserResponse(user);
};
