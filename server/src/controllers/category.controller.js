// src/controllers/category.controller.js
import * as categoryService from '../services/category.service.js';

export async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) { next(err); }
}

export async function listCategories(req, res, next) {
  try {
    const cats = await categoryService.listCategories();
    res.json({ success: true, categories: cats });
  } catch (err) { next(err); }
}

export async function updateCategory(req, res, next) {
  try {
    const ok = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, updated: ok });
  } catch (err) { next(err); }
}

export async function deleteCategory(req, res, next) {
  try {
    const ok = await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, deleted: ok });
  } catch (err) { next(err); }
}
