// src/controllers/tag.controller.js
import * as tagService from '../services/tag.service.js';

export async function createTag(req, res, next) {
  try {
    const tag = await tagService.createTag(req.body.name);
    res.status(201).json({ success: true, tag });
  } catch (err) { next(err); }
}

export async function listTags(req, res, next) {
  try {
    const tags = await tagService.listTags();
    res.json({ success: true, tags });
  } catch (err) { next(err); }
}

export async function deleteTag(req, res, next) {
  try {
    const ok = await tagService.deleteTag(req.params.id);
    res.json({ success: true, deleted: ok });
  } catch (err) { next(err); }
}
