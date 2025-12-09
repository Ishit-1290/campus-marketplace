// src/routes/auth.routes.js
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register, login, logout } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.js';
import { me } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  validate,
  register
);

router.post('/login',
  [ body('email').isEmail(), body('password').notEmpty() ],
  validate,
  login
);
router.post('/logout',
  validate,
  logout
);


router.get('/me', authRequired,me);
export default router;
