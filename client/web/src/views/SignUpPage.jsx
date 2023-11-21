import React, { useState, useEffect } from "react";
import { api_register } from "../API/Register";
import { discord_login } from "../API/Login";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import * as colors from "../constants/colors";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import * as routes from "../constants/routes";
import * as imagesPath from "../constants/imagesPath";

const SignUpPage = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmedPassword, setConfirmedPassword] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [hideConfirmedPassword, setHideConfirmedPassword] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const connectToDiscord = () => {
		window.location.href = routes.CONNECT_DISCORD;
	};

	const togglePasswordVisibility = () => {
		setHidePassword(!hidePassword);
	};

	const toggleConfirmedPasswordVisibility = () => {
		setHideConfirmedPassword(!hideConfirmedPassword);
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
		if (password !== confirmedPassword) {
			setError("Passwords do not match");
			return;
		}
		const data = {
			email,
			username,
			password,
		};

		let response;

		try {
			response = await api_register(data);
		} catch (err) {
			setError(err.response.data.message);
			// Traiter l'erreur ici
		} finally {
			localStorage.setItem("token", response.token);
			navigate(routes.HOME_PAGE);
		}
	};

	return (
		<div style={styles.main_container}>
			<div style={styles.left_container}>
				<img
					src={imagesPath.logoPath}
					alt="logo"
					style={styles.area_logo}
				/>
				<div style={styles.left_container.content}>
					<Typography
						style={styles.left_container.signup_text}
						variant="h4"
						fontWeight={900}
					>
						Sign up to
					</Typography>
					<Typography
						style={styles.left_container.description_text}
						variant="h5"
					>
						AREA is simple !
					</Typography>
					<div
						style={styles.left_container.already_account_container}
					>
						<div
							style={{
								flex: 1,
								flexDirection: "column",
							}}
						>
							<Typography variant="h7">
								If you already have an account <br></br>
							</Typography>
							<Button onClick={() => navigate(routes.SIGN_IN)}>
								<Typography
									style={
										styles.left_container.register_link_text
									}
									variant="h7"
									fontWeight={700}
								>
									Login here !
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
			<div style={styles.register_container}>
				<Typography
					style={styles.register_container.signup_text}
					variant="h5"
					fontWeight={500}
				>
					Sign up
				</Typography>
				<TextField
					error={error}
					style={styles.register_container.email_textfield}
					label="Email"
					variant="outlined"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				></TextField>
				<TextField
					type="text"
					error={error}
					style={styles.register_container.username_textfield}
					label="Username"
					variant="outlined"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				></TextField>
				<div>
					<TextField
						type={hidePassword ? "password" : "text"}
						error={error}
						style={styles.register_container.password_textfield}
						variant="outlined"
						label="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></TextField>
					<Button
						style={styles.register_container.password_eye_button}
						onClick={togglePasswordVisibility}
					>
						<VisibilityTwoToneIcon />
					</Button>
				</div>
				<div>
					<TextField
						type={hideConfirmedPassword ? "password" : "text"}
						error={error}
						helperText={error}
						style={styles.register_container.password_textfield}
						variant="outlined"
						label="Confirm Password"
						value={confirmedPassword}
						onChange={(e) => setConfirmedPassword(e.target.value)}
					></TextField>
					<Button
						style={styles.register_container.password_eye_button}
						onClick={toggleConfirmedPasswordVisibility}
					>
						<VisibilityTwoToneIcon />
					</Button>
				</div>
				<Button
					variant="contained"
					size="large"
					onClick={handleSubmit}
					style={styles.register_container.register_button}
				>
					Register
				</Button>
				<div
					style={styles.register_container.or_continue_with_container}
				>
					<Typography
						style={styles.register_container.or_continue_with_text}
					>
						or continue with
					</Typography>
				</div>
				<div style={styles.register_container.oauth_container}>
					<Button
						style={styles.service_circle_button}
						onClick={connectToDiscord}
					>
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
		flexDirection: "",
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
	register_container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "left",
		flex: 25,
		signup_text: {
			marginBottom: "4vh",
		},
		email_textfield: {
			marginBottom: "4vh",
			borderRadius: 8,
			borderColor: "red",
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
			marginBottom: "4vh",
			width: "100%",
		},
		register_button: {
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
		google_logo: {
			marginRight: "2vw",
		},
		discord_logo: {
			marginRight: "2vw",
		},
		facebook_logo: {},
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
		signup_text: {
			marginBottom: "1vh",
		},
		description_text: {
			marginBottom: "10vh",
		},
		already_account_container: {
			display: "flex",
			flexDirection: "row",
		},
		already_account_text: {},
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
		marginRight: "1vw",
	},
	service_circle_logo: {
		height: "4vw",
	},
};

export default SignUpPage;
