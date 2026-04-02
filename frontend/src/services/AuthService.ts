import type { AxiosResponse } from "axios";
import { API } from "../server";
import type { AuthResponse } from "../models/response/AuthResponse";

export class AuthService {
	static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return API.post<AuthResponse>("/login", { email, password });
	}
	static async register(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return API.post<AuthResponse>("/register", { email, password });
	}
	static async logout(): Promise<void> {
		return API.post("/logout");
	}
}
