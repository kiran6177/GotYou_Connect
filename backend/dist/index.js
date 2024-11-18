import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connection } from "./config/connection.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
connection();
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://got-you.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const limiter = rateLimit({
    windowMs: 1000,
    limit: 20,
    handler: (req, res, next) => {
        res.status(429).json({ error: "Too many Requests!!" });
    },
});
app.use(limiter);
app.get("/", (req, res) => {
    res.status(200).json({ success: "WORKING" });
});
app.use("/api", userRouter);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log("Server Listening on PORT ", PORT);
});
