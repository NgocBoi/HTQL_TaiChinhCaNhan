import * as authService from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.registerUser({
    name,
    email,
    password,
  });

  sendSuccess(res, 201, 'User registered successfully', result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  sendSuccess(res, 200, 'Login successful', result);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.userId);

  sendSuccess(res, 200, 'Profile retrieved successfully', { user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  const user = await authService.updateUserProfile(req.userId, {
    name,
    email,
    currentPassword,
    newPassword,
  });

  sendSuccess(res, 200, 'Profile updated successfully', { user });
});
