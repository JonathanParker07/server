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
    origin: '*',  // Allow all origins temporarily
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Add test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ message: 'Route not found' });
});