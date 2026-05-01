import express from 'express';
import { createCheckoutSession, verifyCheckoutSession } from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);
router.get('/verify-session', authenticate, verifyCheckoutSession);

export default router;