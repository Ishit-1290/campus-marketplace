// src/controllers/user.controller.js
import * as userService from '../services/user.service.js';

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.user_id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
}

export async function updateProfile(req, res, next) {
  try {
    const ok = await userService.updateUser(req.user.user_id, req.body);
    if (!ok) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Updated' });
  } catch (err) { next(err); }
}

// admin: list/delete user
export async function listUsers(req, res, next) {
  try {
    const { page, limit, search } = req.query;
    const rows = await userService.listUsers({ page, limit, search });
    res.json({ success: true, users: rows });
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    const ok = await userService.deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
}
