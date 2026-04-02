import { useContext, useState, type ChangeEvent } from "react";
import { StoreContext } from "../main";
import { observer } from "mobx-react-lite";

export default observer(function LoginPage() {
	const { store } = useContext(StoreContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const inputStyle = "outline w-full px-2 py-1 outline-gray-300 rounded";

	return (
		<form className="flex flex-col items-start gap-8 p-10 w-sm">
			<h1 className="text-4xl">Login</h1>
			<label htmlFor="email" className="w-full">
				<input type="email" id="email" autoComplete="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className={inputStyle} required />
			</label>
			<label htmlFor="password" className="w-full">
				<input type="password" id="password" autoComplete="current-password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className={inputStyle} minLength={5} maxLength={32} required />
			</label>
			<button type="button" className="bg-blue-500 p-2 px-6 rounded text-white cursor-pointer grow-0" onClick={() => store.login(email, password)}>
				Login
			</button>
			<button type="button" className="bg-blue-500 p-2 px-6 rounded text-white cursor-pointer grow-0" onClick={() => store.register(email, password)}>
				Register
			</button>
		</form>
	);
});
