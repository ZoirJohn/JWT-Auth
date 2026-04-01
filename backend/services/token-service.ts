import jwt from "jsonwebtoken";
import TokenSchema from "../models/token-model.ts";
import TokenModel from "../models/token-model.ts";
import UserDTO from "../dtos/user-dto.ts";

class TokenService {
	generateTokens(payload: unknown) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET);
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET);

		return { accessToken, refreshToken };
	}
	async saveToken(userId: string, refreshToken: string) {
		let tokenData = await TokenSchema.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}

		const token = await TokenModel.create({ refreshToken, user: userId });
		return token;
	}
	async removeToken(refreshToken: string) {
		const tokenData = await TokenModel.deleteOne({ refreshToken });
		return tokenData;
	}
	async findToken(refreshToken: string) {
		const tokenData = await TokenModel.findOne({ refreshToken });
		return tokenData;
	}
	validateRefreshToken(refreshToken: string) {
		try {
			const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
			return userData as UserDTO;
		} catch (error) {
			return null;
		}
	}
	validateAccessToken(accessToken: string) {
		try {
			const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
			return userData;
		} catch (error) {
			return null;
		}
	}
}

export default new TokenService();

// When we login from another device with the same email, we will override the existing token which in turn will log out the user from the device that was used initially. The behavior of having multiple tokens for one user can be implemented if there is a logic of deleting expired tokens.
