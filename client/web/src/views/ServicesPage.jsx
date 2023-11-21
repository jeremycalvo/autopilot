import React, { useState } from "react";
import { api_service_connection, api_service_list } from "../API/Service";
import { api_recipe } from "../API/Recipe";
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Typography } from "@mui/material";
import * as routes from "../constants/routes";
import * as urls from "../constants/network";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ServicesPage = () => {
	const logoPath = process.env.PUBLIC_URL + "/area_logo.png";

	const [services, setServices] = useState([]);
	const [recipes, setRecipes] = useState([]);
	const navigate = useNavigate();

	const isServiceConnected = (serviceCode) => {
		return services.includes(serviceCode);
	};

	const connect_to_service = async (service) => {
		window.location.replace(service.link);
	};

	const getServices = async () => {
		const response = await api_service_list();

		setServices(response);
	};

	const getRecipes = async () => {
		const response = await api_recipe();
		for (let i = 0; i < response.length; i++) {
			response[i].logoPath =
			"http://" + urls.backUrl + "/" +response[i].code + ".svg";
		}
		setRecipes(response);
	};

	useEffect(() => {
		checkRedirect();
		const token = localStorage.getItem("token");
		if (!token) {
			navigate(routes.SIGN_IN);
		}
		getServices();
		getRecipes();
	}, []);

	const checkRedirect = async () => {
		if (window.location.href.includes("code=")) {
			let code = window.location.href.split("code=")[1];
			code = code.split("&")[0];
			let data = {
				code: code,
			};
			let service = localStorage.getItem("service_redirection");
			try {
				await api_service_connection(data, service);
			} catch (err) {
				console.log(err);
			} finally {
				localStorage.removeItem("service_redirection");
				window.location.replace(routes.SERVICES_PAGE);
			}
		}
	};

	const handleServiceClick = async (service) => {
		if (!isServiceConnected(service.code)) {
			try {
				localStorage.setItem("service_redirection", service.code);
				await connect_to_service(service);
			} catch (e) {
				console.log(e);
			}
		}
	};

	const displayServices = () => {
		let connected = services.length;
		if (connected === 0) {
			return "No service connected";
		} else if (connected === 1) {
			return "1 service connected";
		} else {
			return connected + " services connected";
		}
	};

	const disconnect = async () => {
		localStorage.removeItem("token");
		navigate(routes.SIGN_IN);
	};

	return (
		<div style={styles.main_container}>
			<Button
				onClick={() => navigate(routes.HOME_PAGE)}
				style={styles.area_button}
			>
				<img src={logoPath} alt="logo" style={styles.area_logo} />
			</Button>
			<Button style={styles.button_logout} onClick={disconnect}>
				<LogoutIcon style={styles.logout_logo}/>
			</Button>
			<div style={styles.services_container}>
				<Typography style={styles.services_title}>
					{displayServices()}
				</Typography>
				<div style={styles.services_list}>
					{recipes.map((item, index) => (
						<Button
							style={{
								...styles.service_button,
								...{
									filter: isServiceConnected(item.code)
										? "grayscale(0%)"
										: "grayscale(100%)",
								},
							}}
							key={index}
							onClick={() => handleServiceClick(item)}
						>
							<img
								src={item.logoPath}
								alt="path"
								style={styles.service_card}
							/>
						</Button>
					))}
				</div>
			</div>
		</div>
	);
};

const styles = {
	main_container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		flex: 1,
		backgroundImage: `url(${process.env.PUBLIC_URL + "/background.jpg"})`,
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		height: "100%",
		minHeight: "100vh",
	},
	area_button: {
		position: "absolute",
		top: "5vh",
		left: "3vw",
	},
	area_logo: {
		height: "12vh",
		width: "36vh",
	},
	button_account: {
		position: "absolute",
		top: "5vh",
		right: "3vw",
	},
	button_settings: {
		position: "absolute",
		top: "5vh",
		right: "10vw",
	},
	account_logo: {
		fontSize: "6vw",
	},
	settings_logo: {
		fontSize: "6vw",
	},
	services_container: {
		marginLeft: "10vw",
	},
	services_title: {
		fontSize: 40,
		marginTop: "25vh",
	},
	services_list: {
		marginTop: "5vh",
	},
	service_card: {
		borderRadius: 30,
		height: "40vh",
	},
	service_button: {
		marginRight: "5vw",
		borderRadius: 30,
	},
	button_logout: {
		position: "absolute",
		top: "5vh",
		right: "3vw",
	},
	logout_logo: {
		fontSize: "6vw",
	},
};

export default ServicesPage;
