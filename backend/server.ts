import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./router/index.ts";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", router);

try {
	mongoose.connect(process.env.DB_CONNECTION_STRING!);
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
} catch (error) {
	console.log(error);
}
