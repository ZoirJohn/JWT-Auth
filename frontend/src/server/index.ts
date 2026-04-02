import axios from "axios";
import type { AuthResponse } from "../models/response/AuthResponse";

export const API = axios.create({
	withCredentials: true,
	baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
	return config;
});

API.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status == 401 && error.config && !error.config._isRetry) {
			originalRequest._isRetry = true;
			try {
				const response = await axios.get<AuthResponse>(`${import.meta.env.VITE_API_URL}/refresh`, { withCredentials: true });
				localStorage.setItem("accessToken", response.data.accessToken);
				return API.request(originalRequest);
			} catch (e) {}
		}
		throw error;
	},
);
