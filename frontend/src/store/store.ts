import { makeAutoObservable } from "mobx";
import type { IUser } from "../models/IUser";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import type { AuthResponse } from "../models/response/AuthResponse";

export class Store {
	user = {} as IUser;
	isAuth = false;
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}
	setAuth(bool: boolean) {
		this.isAuth = bool;
	}
	setUser(user: IUser) {
		this.user = user;
	}
	setLoading(bool: boolean) {
		this.isLoading = bool;
	}
	async login(email: string, password: string) {
		try {
			const res = await AuthService.login(email, password);
			localStorage.setItem("accessToken", res.data.accessToken);
			this.setAuth(true);
			this.setUser(res.data.user);
			console.log(res.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		}
	}
	async register(email: string, password: string) {
		try {
			const res = await AuthService.register(email, password);
			localStorage.setItem("accessToken", res.data.accessToken);
			this.setAuth(true);
			this.setUser(res.data.user);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		}
	}
	async logout() {
		try {
			await AuthService.logout();
			localStorage.removeItem("accessToken");
			this.setAuth(false);
			this.setUser({} as IUser);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		}
	}
	async checkAuth() {
		this.setLoading(true);
		try {
			const res = await axios.get<AuthResponse>(`${import.meta.env.VITE_API_URL}/refresh`, { withCredentials: true });
			localStorage.setItem("accessToken", res.data.accessToken);
			this.setAuth(true);
			this.setUser(res.data.user);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		} finally {
			this.setLoading(false);
		}
	}
}
