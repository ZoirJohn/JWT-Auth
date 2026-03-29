import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/ApiError.ts";

export function ErrorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
	if (error instanceof ApiError) {
		res.status(error.status).json({ message: error.message, errors: error.errors });
	}
	res.status(500).json({ message: "Internal Server Error" });
}
