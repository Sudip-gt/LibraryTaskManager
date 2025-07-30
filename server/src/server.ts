import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

const startServer = async () => {
  await connectDB();

  const PORT: number = parseInt(process.env.PORT || '5000');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();