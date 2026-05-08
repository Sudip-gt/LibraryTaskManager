






import dotenv from 'dotenv';
dotenv.config();




































































import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';

import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import adminRoutes from './routes/adminRoutes';
import taskRoutes from './routes/taskRoutes';
import stripeRoutes from './routes/stripeRoutes';
import { handleStripeWebhook } from './controllers/stripeController';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ err }, 'Database connection error');
    process.exit(1);
  }
};
connectDB();

const app: express.Application = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Stripe webhook needs raw body for signature verification — must be before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim())
  .filter(url => url);

logger.info({ allowedOrigins }, 'Allowed frontend URLs');

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    // Allow Vercel preview deployment URLs for this project
    if (origin.match(/^https:\/\/library-task-manager[a-z0-9-]*\.vercel\.app$/)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stripe', stripeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err }, 'Unhandled error occurred');
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
