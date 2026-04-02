import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./style.css";
import { Store } from "./store/store.ts";

const store = new Store();
export const StoreContext = createContext({ store });

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StoreContext.Provider value={{ store }}>
			<App />
		</StoreContext.Provider>
	</StrictMode>,
);
