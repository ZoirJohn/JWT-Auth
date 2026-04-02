import { useContext, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import { StoreContext } from "./main";
import { observer } from "mobx-react-lite";

function App() {
	const { store } = useContext(StoreContext);
	useEffect(() => {
		const initAuth = async () => {
			if (localStorage.getItem("accessToken")) {
				await store.checkAuth();
			}
		};
		initAuth();
	}, []);

	if (store.isLoading) {
		return (
			<section className="flex flex-col justify-center items-center min-h-screen">
				<h1 className="text-2xl">Loading...</h1>
			</section>
		);
	}
	if (!store.isAuth) {
		return (
			<section className="flex flex-col justify-center items-center min-h-screen">
				<LoginPage />
			</section>
		);
	}

	return (
		<section className="flex flex-col justify-center items-center min-h-screen">
			Congratulations!
			<button type="button" className="bg-blue-500 p-2 px-6 rounded text-white cursor-pointer grow-0" onClick={() => store.logout()}>
				Logout
			</button>
		</section>
	);
}

export default observer(App);
