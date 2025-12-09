// src/routes/category.routes.js
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { createCategory, listCategories, updateCategory, deleteCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', authRequired, adminOnly, [ body('name').notEmpty() ], validate, createCategory);
router.put('/:id', authRequired, adminOnly, updateCategory);
router.delete('/:id', authRequired, adminOnly, deleteCategory);

export default router;
