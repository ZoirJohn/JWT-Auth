import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/ApiError";
import TokenService from "../services/token-service";

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
	try {
		const authToken = req.headers.authorization;
		if (!authToken) return next(ApiError.UnauthorizedError());

		const accessToken = authToken.split(" ")[1];
		if (!accessToken) return next(ApiError.UnauthorizedError());

		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) return next(ApiError.UnauthorizedError());

		req.user = userData;
		next();
	} catch (error) {
		return next(error);
	}
}
