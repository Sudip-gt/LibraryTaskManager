import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

import authRoutes from "./routes/auth";

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI as string)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port 5000");
    });
}).catch((error) => {
    console.log(error);
});