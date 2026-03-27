import UserModel, { IUser } from "../models/user-model.ts";

class UserDTO {
	id: string;
	email: string;
	isActivated: boolean;

	constructor(model: IUser) {
		this.id = model._id.toString();
		this.email = model.email;
		this.isActivated = model.isActivated;
	}
}
export default UserDTO;
