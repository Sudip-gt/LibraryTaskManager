import express from 'express';
import { createCheckoutSession } from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);

export default router;