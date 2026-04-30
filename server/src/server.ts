import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import { handleStripeWebhook } from './controllers/stripeController';

dotenv.config();

const app = express();

// Stripe webhook needs raw body for signature verification — must be before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import taskRoutes from "./routes/taskRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.use("/api/stripe", stripeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) {
    console.warn('WARNING: CLIENT_URL is not set. CORS will reject all cross-origin requests.');
  }

  await connectDB();

  const PORT: number = parseInt(process.env.PORT || '5000');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend URL: ${clientUrl || 'NOT SET'}`);
  });
};

startServer();