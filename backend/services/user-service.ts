import UserSchema from "../models/user-model.ts";
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
		const { accessToken, refreshToken } = TokenService.generateTokens({ ...userDTO });
		await TokenService.saveToken(userDTO.id, refreshToken);

		return {
			...userDTO,
			refreshToken,
			accessToken,
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
}

export default new UserService();
