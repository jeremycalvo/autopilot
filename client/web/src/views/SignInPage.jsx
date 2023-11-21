import React, { useState, useEffect } from "react";
import { api_login, discord_login } from "../API/Login";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import * as colors from "../constants/colors";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import * as routes from "../constants/routes";
import * as imagesPath from "../constants/imagesPath";

const SignInPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const togglePasswordVisibility = () => {
		setHidePassword(!hidePassword);
	};

	const connectToDiscord = () => {
		window.location.href = routes.CONNECT_DISCORD;
	};

	const checkRedirect = async () => {
		localStorage.removeItem("token");
		if (window.location.href.includes("code=")) {
			let code = window.location.href.split("code=")[1];
			code = code.split("&")[0];
			let data = {
				code: code,
			};
			let response;
			try {
				response = await discord_login(data);
			} catch (err) {
				console.log(err);
			} finally {
				localStorage.setItem("token", response.token);
				let token = localStorage.getItem("token");
				if (token !== null) {
					navigate(routes.HOME_PAGE);
				}
			}
		}
	};

	useEffect(() => {
		checkRedirect();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = {
			username,
			password,
		};

		let response;

		try {
			response = await api_login(data);
		} catch (err) {
			setError(err.response.data.message);
			// Traiter l'erreur ici
		}
		finally {
			localStorage.setItem("token", response.token);
			navigate(routes.HOME_PAGE);
		}
	};

	return (
		<div style={styles.main_container}>
			<div style={styles.left_container}>
				<img src={imagesPath.logoPath} alt="logo" style={styles.area_logo} />
				<div style={styles.left_container.content}>
					<Typography
						style={styles.left_container.signin_text}
						variant="h4"
						fontWeight={900}
					>
						Sign in to
					</Typography>
					<Typography
						style={styles.left_container.description_text}
						variant="h5"
					>
						AREA is simple !
					</Typography>
					<div style={styles.left_container.no_account_container}>
						<div
							style={{
								flex: 1,
								flexDirection: "column",
							}}
						>
							<Typography variant="h7">
								If you don’t have an account <br></br>
							</Typography>
							<Button onClick={() => navigate(routes.SIGN_UP)}>
								<Typography
									style={
										styles.left_container.register_link_text
									}
									variant="h7"
									fontWeight={700}
								>
									Register here !
								</Typography>
							</Button>
						</div>
							<img
								src={imagesPath.fellowPath}
								alt="logo"
								style={styles.fellow_logo}
							/>
					</div>
				</div>
				<div style={styles.left_container.right_container}></div>
			</div>
			<div style={styles.login_container}>
				<Typography
					style={styles.login_container.signin_text}
					variant="h5"
					fontWeight={500}
				>
					Sign in
				</Typography>
				<TextField
					error={error}
					style={styles.login_container.username_textfield}
					label="Username"
					variant="outlined"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				></TextField>
				<div>
					<TextField
						type={hidePassword ? "password" : "text"}
						error={error}
						helperText={error}
						style={styles.login_container.password_textfield}
						variant="outlined"
						label="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></TextField>
					<Button
						style={styles.login_container.password_eye_button}
						onClick={togglePasswordVisibility}
					>
						<VisibilityTwoToneIcon />
					</Button>
				</div>
				<Typography
					fontSize={14}
					style={styles.login_container.forgot_password_text}
				>
					Forgot password ?
				</Typography>
				<Button
					variant="contained"
					size="large"
					onClick={handleSubmit}
					style={styles.login_container.login_button}
				>
					Login
				</Button>
				<div style={styles.login_container.or_continue_with_container}>
					<Typography
						style={styles.login_container.or_continue_with_text}
					>
						or continue with
					</Typography>
				</div>
				<div style={styles.login_container.oauth_container}>
					<Button style={styles.service_circle_button} onClick={connectToDiscord}>
						<img
							src={imagesPath.discordFullPath}
							alt="logo"
							style={styles.service_circle_logo}
						/>
					</Button>
				</div>
			</div>
			<div style={styles.right_container}></div>
		</div>
	);
};

const styles = {
	main_container: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
		backgroundImage: `url(${process.env.PUBLIC_URL + "/background.jpg"})`,
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		height: "100%",
		minHeight: "100vh",
	},
	area_logo: {
		position: "absolute",
		top: "5vh",
		left: "3vw",
		height: "12vh",
		width: "36vh",
	},
	login_container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "left",
		flex: 25,
		signin_text: {
			marginTop: "10vh",
			marginBottom: "4vh",
		},
		username_textfield: {
			marginBottom: "4vh",
			borderRadius: 8,
		},
		password_eye_button: {
			position: "absolute",
			marginLeft: "-8vw",
			marginTop: "1.5vh",
		},
		password_textfield: {
			borderRadius: 8,
			width: "100%",
		},
		forgot_password_text: {
			marginTop: "2vh",
			marginBottom: "6vh",
			alignSelf: "flex-end",
		},
		login_button: {
			marginTop: "0vh",
			marginBottom: "5vh",
			height: "8vh",
			borderRadius: 9,
		},
		or_continue_with_container: {
			display: "flex",
			justifyContent: "center",
			marginBottom: "2vh",
		},
		or_continue_with_text: {},
		oauth_container: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
		},
	},
	left_container: {
		display: "flex",
		flex: 55,
		content: {
			flex: 85,
			marginLeft: "14vw",
			marginTop: "30vh",
		},
		right_container: {
			flex: 15,
		},
		signin_text: {
			marginBottom: "1vh",
		},
		description_text: {
			marginBottom: "10vh",
		},
		no_account_container: {
			display: "flex",
			flexDirection: "row",
		},
		no_account_text: {},
		register_link_text: {
			color: colors.PRIMARY,
			marginLeft: "-0.5vw",
		},
	},
	right_container: {
		display: "flex",
		flex: 15,
	},
	fellow_logo: {
		height: "50vh",
		flex: 1,
	},
	service_circle_button: {
		marginRight: "1vw"
	},
	service_circle_logo: {
		height: "4vw",
	},
};

export default SignInPage;
