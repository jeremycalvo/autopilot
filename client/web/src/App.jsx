import "./App.css";
import SignInPage from "./views/SignInPage";
import SignUpPage from "./views/SignUpPage";
import HomePage from "./views/HomePage";
import ApkPage from "./views/ApkPage";
import ServicesPage from "./views/ServicesPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as colors from "./constants/colors";

const theme = createTheme({
	palette: {
		primary: {
			main: colors.PRIMARY,
		},
		secondary: {
			main: colors.SECONDARY,
		},
		info: {
			main: colors.TERTIARY,
		},
		grey: {
			main: colors.GREY,
		},
	},
});

const App = () => (
	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<div>
				<Routes>
					<Route path={ROUTES.LANDING} element={<SignInPage />} />
					<Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
					<Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
					<Route path={ROUTES.HOME_PAGE} element={<HomePage />} />
					<Route path={ROUTES.SERVICES_PAGE} element={<ServicesPage />} />
					<Route path={ROUTES.APK_DOWNLOAD} element={<ApkPage />} />
				</Routes>
			</div>
		</BrowserRouter>
	</ThemeProvider>
);

export default App;
