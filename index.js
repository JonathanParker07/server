import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"
import userRoute from "./routes/userRoute.js"
import authRoute from "./routes/authRoute.js"
import { authMiddleware } from "./middleware/auth.js"

// Load environment variables first
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const MONGOURL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
    .connect(MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connected successfully")
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((error) => console.log(error));

// Auth routes (unprotected)
app.use("/api/auth", authRoute);

// Protected routes
app.use("/api", authMiddleware, userRoute);