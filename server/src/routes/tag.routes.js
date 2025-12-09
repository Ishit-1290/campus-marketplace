// src/routes/tag.routes.js
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { createTag, listTags, deleteTag } from '../controllers/tag.controller.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listTags);
router.post('/', authRequired, adminOnly, [ body('name').notEmpty() ], validate, createTag);
router.delete('/:id', authRequired, adminOnly, deleteTag);

export default router;
