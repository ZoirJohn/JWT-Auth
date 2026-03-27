import UserSchema from "../models/user-model.ts";
import bcrypt from "bcrypt";
import MailService from "./mail-service.ts";
import TokenService from "./token-service.ts";
import UserDTO from "../dtos/user-dto.ts";

class UserService {
	async register(email: string, password: string) {
		let user = await UserSchema.findOne({ email });
		if (user) {
			throw new Error("", { cause: "DUPLICATE_EMAIL" });
		}

		const hashedPassword = await bcrypt.hash(password, 4);
		const activationLink = crypto.randomUUID();

		user = await UserSchema.create({ email, password: hashedPassword, activationLink });
		await MailService.sendActivationMail(email, activationLink);

		const userDTO = new UserDTO(user);
		const { accessToken, refreshToken } = TokenService.generateTokens({ ...userDTO });
		await TokenService.saveToken(userDTO.id, refreshToken);

		return {
			...userDTO,
			refreshToken,
			accessToken,
		};
	}
}

export default new UserService();
