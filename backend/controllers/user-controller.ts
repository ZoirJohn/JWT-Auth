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
			return next(error);
		}
	}
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const userData = await UserService.login(email, password);
			res.cookie("refreshToken", userData.refreshToken, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (error) {
			return next(error);
		}
	}
	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			const token = await UserService.logout(refreshToken);
			res.clearCookie("refreshToken");
			return res.json(token);
		} catch (error) {}
	}
	async activate(req: Request, res: Response, next: NextFunction) {
		try {
			const link = req.params.link;
			await UserService.activate(link as string);
			return res.redirect(process.env.CLIENT_URL!);
		} catch (error) {
			return next(error);
		}
	}
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await UserService.refresh(refreshToken);
			res.cookie("refreshToken", userData.refreshToken, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (error) {
			return next(error);
		}
	}
	async test(req: Request, res: Response, next: NextFunction) {
		try {
			return res.status(200).json({ message: "Everything is fine!" });
		} catch (error) {
			return next(error);
		}
	}
	async users(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await UserService.getAllUsers();
			return res.json(users);
		} catch (error) {
			return next(error);
		}
	}
}

export default new UserController();
