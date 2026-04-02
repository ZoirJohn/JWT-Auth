import UserSchema, { IUser } from "../models/user-model.ts";
import bcrypt from "bcrypt";
import MailService from "./mail-service.ts";
import TokenService from "./token-service.ts";
import UserDTO from "../dtos/user-dto.ts";
import { ApiError } from "../exceptions/ApiError.ts";

class UserService {
	async register(email: string, password: string) {
		let user = await UserSchema.findOne({ email });
		if (user) {
			throw ApiError.BadRequest("User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 4);
		const activationLink = crypto.randomUUID();

		user = await UserSchema.create({ email, password: hashedPassword, activationLink });
		await MailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);

		const userDTO = new UserDTO(user);
		const tokens = TokenService.generateTokens({ ...userDTO });
		await TokenService.saveToken(userDTO.id, tokens.refreshToken);

		return {
			user: userDTO,
			...tokens,
		};
	}
	async activate(activationLink: string) {
		const user = await UserSchema.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequest("Incorrect activation link");
		}
		user.isActivated = true;
		await user.save();
	}
	async login(email: string, password: string) {
		let user = await UserSchema.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest("User not found");
		}

		const isPassEquals = await bcrypt.compare(password, user.password);

		if (!isPassEquals) {
			throw ApiError.BadRequest("Incorrect password");
		}

		const userDTO = new UserDTO(user);

		const tokens = TokenService.generateTokens({ ...userDTO });
		await TokenService.saveToken(userDTO.id, tokens.refreshToken);

		return {
			user: userDTO,
			...tokens,
		};
	}
	async logout(refreshToken: string) {
		const token = await TokenService.removeToken(refreshToken);
		return token;
	}
	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}
		const userData = TokenService.validateRefreshToken(refreshToken);
		const tokenData = await TokenService.findToken(refreshToken);

		if (!userData || !tokenData) {
			throw ApiError.UnauthorizedError();
		}

		const user = await UserSchema.findById(userData.id);
		const userDTO = new UserDTO(user as IUser);
		const tokens = TokenService.generateTokens({ ...userDTO });
		await TokenService.saveToken(userDTO.id, refreshToken);

		return {
			user: userDTO,
			...tokens,
		};
	}
	async getAllUsers() {
		const users = await UserSchema.find();
		return users
	}
}

export default new UserService();
