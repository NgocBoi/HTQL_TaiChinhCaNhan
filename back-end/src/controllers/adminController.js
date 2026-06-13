import * as adminService from '../services/adminService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  sendSuccess(res, 200, 'Users retrieved successfully', { users });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  sendSuccess(res, 200, 'User retrieved successfully', { user });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  sendSuccess(res, 201, 'User created successfully', { user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(
    req.userId,
    req.params.id,
    req.body
  );
  sendSuccess(res, 200, 'User updated successfully', { user });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserStatus(
    req.userId,
    req.params.id,
    req.body.isActive
  );
  sendSuccess(res, 200, 'User status updated successfully', { user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.userId, req.params.id);
  sendSuccess(res, 200, 'User deleted successfully', result);
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboard = await adminService.getAdminDashboard();
  sendSuccess(res, 200, 'Admin dashboard retrieved successfully', {
    dashboard,
  });
});
