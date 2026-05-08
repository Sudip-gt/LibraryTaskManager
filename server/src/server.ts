import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import logger from './utils/logger';

import { handleStripeWebhook } from './controllers/stripeController';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import stripeRoutes from './routes/stripeRoutes';
import taskRoutes from './routes/taskRoutes';

type AppError = Error & {
  status?: number;
};

const app = express();
const port = Number.parseInt(process.env.PORT || '5000', 10);
const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  await mongoose.connect(mongoUri);
  logger.info('MongoDB connected');
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (
      /^https:\/\/library-task-manager[a-z0-9-]*\.vercel\.app$/.test(origin) ||
      origin === 'http://localhost:5173'
    ) {
      callback(null, true);
      return;
    }

    const err: AppError = new Error(`CORS blocked for origin: ${origin}`);
    err.status = 403;
    callback(err);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

logger.info({ allowedOrigins }, 'Allowed frontend URLs');

// Stripe webhook needs raw body for signature verification before JSON parsing.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stripe', stripeRoutes);

app.get('/health', (_req: Request, res: Response) => {
  logger.info('Health check requested');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from server!');
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error occurred');

  const status = err.status || 500;
  const message = status === 403 ? 'Forbidden' : 'Internal Server Error';

  res.status(status).json({ message });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    logger.error({ err }, 'Server startup failed');
    process.exit(1);
  }
};

void startServer();
