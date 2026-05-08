import express from 'express';
import rateLimit from 'express-rate-limit';
import { getMe, login, logout, refresh, register } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { loginSchema, registerSchema } from '../middleware/schemas';
import { validate } from '../middleware/validate';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    message: { message: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
