import { NextFunction, Request, Response } from "express";
import UserService from "../services/user-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/ApiError.ts";

class UserController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest("Validation error", errors.array()));
			}
			const { email, password } = req.body;
			const user = await UserService.register(email, password);
			res.cookie("refreshToken", user.refreshToken, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(user);
		} catch (error) {
			next(error);
		}
	}
	async login(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}
	async logout(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}
	async activate(req: Request, res: Response, next: NextFunction) {
		try {
			const link = req.params.link;
			await UserService.activate(link as string);
			return res.redirect(process.env.CLIENT_URL!);
		} catch (error) {
			next(error);
		}
	}
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}
	async test(req: Request, res: Response, next: NextFunction) {
		try {
			return res.status(200).json({ message: "Everything is fine!" });
		} catch (error) {}
	}
}

export default new UserController();
