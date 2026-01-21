import mongoose from "mongoose";
import { seedBooks } from "./seeders/bookSeeder";

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library";

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        await seedBooks();

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
