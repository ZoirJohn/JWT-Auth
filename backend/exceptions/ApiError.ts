import { ValidationError } from "express-validator";

export class ApiError extends Error {
	status: number;
	errors: string[];
	constructor(status: number, message: string, errors: string[] = []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}
	static UnauthorizedError() {
		return new ApiError(401, "User is not authorized");
	}
	static BadRequest(message: string, errors: any = []) {
		return new ApiError(400, message, errors);
	}
}
