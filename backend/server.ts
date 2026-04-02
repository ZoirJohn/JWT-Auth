import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./router/index.ts";
import mongoose from "mongoose";
import { ErrorMiddleware } from "./middlewares/error-middleware.ts";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);
app.use("/api", router);
app.use(ErrorMiddleware);

try {
	mongoose.connect(process.env.DB_URL!);
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
} catch (error) {
	console.log(error);
}
