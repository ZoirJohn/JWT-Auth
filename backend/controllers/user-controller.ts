import { NextFunction, Request, Response } from "express";
import UserService from "../services/user-service";

class UserController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const user = await UserService.register(email, password);
			res.cookie("refreshToken", user.refreshToken, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(user);
		} catch (error) {
			if (error instanceof Error) {
				if (error.cause == "DUPLICATE_EMAIL") res.status(409).json({ message: "User with this email already exists" });
			} else {
				return res.status(500).json({ message: "Internal Server Error" });
			}
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
		} catch (error) {}
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
