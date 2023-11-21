import React, { useEffect, useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LogoutIcon from "@mui/icons-material/Logout";
import {
	Button,
	Typography,
	Modal,
	Box,
	Select,
	MenuItem,
	TextField,
	Paper,
} from "@mui/material";
import * as routes from "../constants/routes";
import * as colors from "../constants/colors";
import * as urls from "../constants/network";
import { useNavigate } from "react-router-dom";
import * as imagesPath from "../constants/imagesPath";
import { api_recipe, api_recipe_list } from "../API/Recipe";
import { api_scenario, api_recipe_delete } from "../API/Scenario";
import { api_service_list } from "../API/Service";

const HomePage = () => {
	const navigate = useNavigate();
	const noService = { logoPath: imagesPath.serviceCardPath };
	const logoPath = process.env.PUBLIC_URL + "/area_logo.png";
	const [openActionModal, setOpenActionModal] = useState(false);
	const [openReactionModal, setOpenReactionModal] = useState(false);
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openServiceModal, setOpenServiceModal] = useState(false);
	const [serviceModalPicked, setServiceModalPicked] = useState(noService);
	const [triggerModalPicked, setTriggerModalPicked] = useState(null);
	const [functionModalPicked, setFunctionModalPicked] = useState(null);
	const [paramsModalFilled, setParamsModalFilled] = useState([]);
	const [areaName, setAreaName] = useState("");
	const [actionDatas, setActionDatas] = useState(null);
	const [reactionDatas, setReactionDatas] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [services, setServices] = useState([]);
	const [scenarios, setScenarios] = useState([]);
	const [modalServiceState, setModalServiceState] = useState("action");

	const getRecipes = async () => {
		const response = await api_recipe();
		for (let i = 0; i < response.length; i++) {
			response[i].logoPath =
				"http://" + urls.backUrl + "/" + response[i].code + ".svg";
		}
		setRecipes(response);
	};

	const getActionOrReactionServices = () => {
		let actionServices = [];
		for (let i = 0; i < services.length; i++) {
			for (let j = 0; j < recipes.length; j++) {
				if (services[i] == recipes[j].code) {
					if (modalServiceState == "action") {
						if (recipes[j]?.triggers?.length > 0) {
							actionServices.push(services[i]);
						}
					} else if (modalServiceState == "reaction") {
						if (recipes[j]?.reactions?.length > 0) {
							actionServices.push(services[i]);
						}
					}
				}
			}
		}
		return actionServices;
	};

	const getServices = async () => {
		const response = await api_service_list();
		setServices(response);
	};

	const getScenarios = async () => {
		const response = await api_recipe_list();
		for (let i = 0; i < response.length; i++) {
			response[i].action.logoPath =
				"http://" +
				urls.backUrl +
				"/" +
				response[i].action.service +
				".svg";
			response[i].reaction.logoPath =
				"http://" +
				urls.backUrl +
				"/" +
				response[i].reaction.service +
				".svg";
		}
		setScenarios(response);
	};

	const deleteScenario = async (id) => {
		await api_recipe_delete(id);
		getScenarios();
	};

	const handleTriggerModalPicked = (trigger) => {
		const triggerName = trigger.split(" -")[0];
		const triggerPicked = serviceModalPicked.triggers.find(
			(t) => t.name === triggerName
		);
		setTriggerModalPicked(triggerPicked);
	};

	const handleFunctionModalPicked = (functionn) => {
		const functionName = functionn.split(" -")[0];
		const functionPicked = serviceModalPicked.reactions.find(
			(f) => f.name === functionName
		);
		setFunctionModalPicked(functionPicked);
	};

	const checkIfActionIsFullfilled = () => {
		if (triggerModalPicked) {
			if (triggerModalPicked.params.length === paramsModalFilled.length) {
				return true;
			}
		}
		return false;
	};

	const checkIfReactionIsFullfilled = () => {
		if (functionModalPicked) {
			if (
				functionModalPicked.params.length === paramsModalFilled.length
			) {
				return true;
			}
		}
		return false;
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate(routes.SIGN_IN);
		}
		getServices();
		getRecipes();
		getScenarios();
	}, []);

	const handleCloseActionModal = () => {
		setOpenActionModal(false);
		setServiceModalPicked(noService);
		setTriggerModalPicked(null);
		setParamsModalFilled([]);
	};

	const handleCloseRecapModal = () => {
		handleCloseActionModal();
		handleCloseReactionModal();
		setOpenRecapModal(false);
		setAreaName("");
	};

	const handleCloseServiceModal = () => {
		setOpenServiceModal(false);
	};

	const pushActionDatas = () => {
		const action = {
			service: serviceModalPicked.code,
			trigger: triggerModalPicked.code,
			params: paramsModalFilled,
		};
		setActionDatas(action);
	};

	const findServiceByCode = (serviceCode) => {
		for (let i = 0; i < recipes.length; i++) {
			if (recipes[i].code === serviceCode) {
				return recipes[i];
			}
		}
		return "Service not found";
	};

	const findTriggerByCode = (triggerCode) => {
		for (let i = 0; i < recipes.length; i++) {
			for (let j = 0; j < recipes[i].triggers.length; j++) {
				if (recipes[i].triggers[j].code === triggerCode) {
					return recipes[i].triggers[j];
				}
			}
		}
		return "Trigger not found";
	};

	const pushReactionDatas = () => {
		const reaction = {
			service: serviceModalPicked.code,
			function: functionModalPicked.code,
			params: paramsModalFilled,
		};
		setReactionDatas(reaction);
	};

	const getImagePath = (serviceCode) => {
		return "http://" + urls.backUrl + "/" + serviceCode + ".svg";
	};

	const handleActionOk = () => {
		setModalServiceState("reaction");
		pushActionDatas();
		handleCloseActionModal();
		setOpenReactionModal(true);
	};

	const add_scenario_to_backend = async () => {
		try {
			await api_scenario(actionDatas, reactionDatas, areaName);
		} catch (err) {
			console.log(err);
		} finally {
			console.log("Scenario added to backend");
		}
	};

	const handleReactionOk = () => {
		pushReactionDatas();
		handleCloseReactionModal();
		setOpenRecapModal(true);
	};

	const handleRecapFinish = async () => {
		await add_scenario_to_backend();
		handleCloseRecapModal();
		getScenarios();
	};

	const handleCloseReactionModal = () => {
		setModalServiceState("action");
		setServiceModalPicked(noService);
		setFunctionModalPicked(null);
		setParamsModalFilled([]);
		setOpenReactionModal(false);
	};

	const handleServiceModalPicked = (serviceCode) => {
		setOpenServiceModal(false);
		setServiceModalPicked(findServiceByCode(serviceCode));
		setTriggerModalPicked(null);
		setParamsModalFilled([]);
		setFunctionModalPicked(null);
	};

	const disconnect = async () => {
		localStorage.removeItem("token");
		navigate(routes.SIGN_IN);
	};

	return (
		<div style={styles.main_container}>
			<img src={logoPath} alt="logo" style={styles.area_logo} />
			<Button style={styles.button_logout} onClick={disconnect}>
				<LogoutIcon style={styles.logout_logo} />
			</Button>
			<Button
				style={styles.button_services}
				onClick={() => navigate(routes.SERVICES_PAGE)}
			>
				<AccountBalanceWalletOutlinedIcon
					style={styles.settings_logo}
					color="primary"
				/>
			</Button>
			<div style={styles.scenario_container}>
				{scenarios.map((item, index) => (
					<div style={styles.scenario_card_container} key={index}>
						<Paper
							style={styles.scenario_card}
							elevation={3}
							key={index}
						>
							<div style={styles.scenario_left_container}>
								<img
									src={imagesPath.automatePath}
									alt="logo"
									style={styles.scenario_logo}
								/>
							</div>
							<div>
								<Typography
									style={styles.scenario_title}
									fontWeight="bold"
								>
									{item.name}
								</Typography>
								<div style={styles.scenario_content}>
									<img
										src={item.action.logoPath}
										alt="logo"
										style={styles.action_scenario_logo}
									/>
									<ArrowRightAltIcon
										style={styles.arrow_scenario_icon}
									/>
									<img
										src={item.reaction.logoPath}
										alt="logo"
										style={styles.action_scenario_logo}
									/>
								</div>
							</div>
						</Paper>
						<Button
							style={styles.delete_scenario_button}
							onClick={() => deleteScenario(item._id)}
						>
							<DeleteForeverIcon
								style={styles.delete_scenario_icon}
							/>
						</Button>
					</div>
				))}
				<Button
					variant="contained"
					size="large"
					style={styles.add_scenario_button}
					onClick={() => setOpenActionModal(true)}
				>
					<ControlPointIcon style={styles.add_scenario_icon} />
					<Typography>Add a scenario</Typography>
				</Button>
			</div>
			<Modal
				open={openServiceModal}
				onClose={handleCloseServiceModal}
				aria-labelledby="add-service-modal-title"
				aria-describedby="add-service-modal-description"
			>
				<Box style={styles.box_service_modal}>
					<Typography
						id="modal-modal-title"
						style={styles.modal_service_text}
						fontWeight="bold"
					>
						Choose a service
					</Typography>
					{getActionOrReactionServices().length === 0 && (
						<Typography
							id="modal-modal-title"
							style={styles.modal_service_text}
						>
							No service available
						</Typography>
					)}
					<div style={styles.service_list}>
						{getActionOrReactionServices().map((item, index) => (
							<Button
								style={styles.service_modal_button}
								onClick={() => handleServiceModalPicked(item)}
								key={index}
							>
								<img
									src={getImagePath(item)}
									alt="logo"
									style={styles.service_modal_card}
								/>
							</Button>
						))}
					</div>
				</Box>
			</Modal>
			<Modal
				open={openActionModal}
				onClose={handleCloseActionModal}
				aria-labelledby="add-scenario-modal-title"
				aria-describedby="add-scenario-modal-description"
			>
				<Box style={styles.box_modal}>
					<Typography
						id="modal-modal-title"
						style={styles.modal_service_text}
						fontWeight="bold"
					>
						Choose an Action
					</Typography>
					<Button
						style={styles.service_modal_button}
						onClick={() => setOpenServiceModal(true)}
					>
						<img
							src={serviceModalPicked?.logoPath}
							alt="logo"
							style={styles.service_modal_card}
						/>
					</Button>
					{serviceModalPicked.code !== noService.code && (
						<div>
							<Typography
								id="modal-modal-title"
								style={styles.modal_trigger_text}
								fontWeight="bold"
							>
								Choose a trigger
							</Typography>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								onChange={(e) => {
									handleTriggerModalPicked(e.target.value);
								}}
								value={serviceModalPicked?.triggers?.name}
								style={styles.select_modal}
							>
								{serviceModalPicked?.triggers?.map(
									(trigger, index) => (
										<MenuItem
											value={trigger.name}
											key={index}
										>
											{trigger.name} -{" "}
											{trigger.description}
										</MenuItem>
									)
								)}
							</Select>
						</div>
					)}
					{triggerModalPicked &&
						triggerModalPicked?.params?.length > 0 && (
							<div style={{ flexDirection: "row" }}>
								<Typography
									id="modal-modal-title"
									style={styles.modal_params_action_text}
									fontWeight="bold"
								>
									Fullfill the parameters
								</Typography>
								<div style={styles.params_list}>
									{triggerModalPicked?.params?.map(
										(param, index) => (
											<div key={index}>
												<TextField
													id="standard-basic"
													label={param}
													style={
														styles.textfield_modal
													}
													onChange={(e) => {
														const newParams = [
															...paramsModalFilled,
														];
														newParams[index] =
															e.target.value;
														setParamsModalFilled(
															newParams
														);
													}}
												/>
											</div>
										)
									)}
								</div>
							</div>
						)}
					{checkIfActionIsFullfilled() && (
						<Button
							style={styles.button_validate}
							onClick={handleActionOk}
						>
							<img
								src={imagesPath.okButtonPath}
								alt="logo"
								style={styles.ok_button_image}
							/>
						</Button>
					)}
				</Box>
			</Modal>
			<Modal
				open={openReactionModal}
				onClose={handleCloseReactionModal}
				aria-labelledby="add-scenario-modal-title"
				aria-describedby="add-scenario-modal-description"
			>
				<Box style={styles.box_modal}>
					<Typography
						id="modal-modal-title"
						style={styles.modal_service_text}
						fontWeight="bold"
					>
						Choose a Reaction
					</Typography>
					<Button
						style={styles.service_modal_button}
						onClick={() => setOpenServiceModal(true)}
					>
						<img
							src={serviceModalPicked?.logoPath}
							alt="logo"
							style={styles.service_modal_card}
						/>
					</Button>
					{serviceModalPicked.code !== noService.code && (
						<div>
							<Typography
								id="modal-modal-title"
								style={styles.modal_trigger_text}
								fontWeight="bold"
							>
								Choose a function
							</Typography>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								onChange={(e) => {
									handleFunctionModalPicked(e.target.value);
								}}
								value={serviceModalPicked?.reactions?.name}
								style={styles.select_modal}
							>
								{serviceModalPicked?.reactions?.map(
									(reaction, index) => (
										<MenuItem
											value={reaction.name}
											key={index}
										>
											{reaction.name} -{" "}
											{reaction.description}
										</MenuItem>
									)
								)}
							</Select>
						</div>
					)}
					{functionModalPicked &&
						functionModalPicked?.params?.length > 0 && (
							<div style={{ flexDirection: "row" }}>
								<Typography
									id="modal-modal-title"
									style={styles.modal_params_reaction_text}
									fontWeight="bold"
								>
									Fullfill the parameters
								</Typography>
								<div style={styles.return_values_list}>
									{findTriggerByCode(
										actionDatas?.trigger
									)?.returnValues?.map(
										(returnValue, index) => (
											<div key={index}>
												<Typography
													style={
														styles.return_value_text
													}
												>
													${returnValue}
												</Typography>
											</div>
										)
									)}
								</div>
								<div style={styles.params_list}>
									{functionModalPicked?.params?.map(
										(param, index) => (
											<div key={index}>
												<TextField
													id="standard-basic"
													label={param}
													style={
														styles.textfield_modal
													}
													onChange={(e) => {
														const newParams = [
															...paramsModalFilled,
														];
														newParams[index] =
															e.target.value;
														setParamsModalFilled(
															newParams
														);
													}}
												/>
											</div>
										)
									)}
								</div>
							</div>
						)}
					{checkIfReactionIsFullfilled() && (
						<Button
							style={styles.button_validate}
							onClick={handleReactionOk}
						>
							<img
								src={imagesPath.okButtonPath}
								alt="logo"
								style={styles.ok_button_image}
							/>
						</Button>
					)}
				</Box>
			</Modal>
			<Modal
				open={openRecapModal}
				onClose={handleCloseRecapModal}
				aria-labelledby="add-scenario-modal-title"
				aria-describedby="add-scenario-modal-description"
			>
				<Box style={styles.box_modal}>
					<Typography
						id="modal-modal-title"
						style={styles.modal_service_text}
						fontWeight="bold"
					>
						Recap'
					</Typography>
					<div style={styles.services_recap_modal}>
						<img
							src={getImagePath(actionDatas?.service)}
							alt="logo"
							style={styles.service_modal_card}
						/>
						<ArrowRightAltIcon style={styles.arrow_recap_icon} />
						<img
							src={getImagePath(reactionDatas?.service)}
							alt="logo"
							style={styles.service_modal_card}
						/>
					</div>
					<div>
						<Typography
							id="modal-modal-title"
							style={styles.modal_name_text}
							fontWeight="bold"
						>
							Choose a name
						</Typography>
						<TextField
							id="standard-basic"
							label="Name"
							style={styles.textfield_recap_modal}
							onChange={(e) => {
								setAreaName(e.target.value);
							}}
						></TextField>
					</div>
					{areaName.length > 0 && (
						<Button
							style={styles.button_validate}
							onClick={handleRecapFinish}
						>
							<img
								src={imagesPath.finishButtonPath}
								alt="logo"
								style={styles.ok_button_image}
							/>
						</Button>
					)}
				</Box>
			</Modal>
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
	button_services: {
		position: "absolute",
		top: "5vh",
		right: "13vw",
	},
	button_logout: {
		position: "absolute",
		top: "5vh",
		right: "3vw",
	},
	logout_logo: {
		fontSize: "6vw",
	},
	settings_logo: {
		fontSize: "6vw",
	},
	area_logo: {
		position: "absolute",
		top: "5vh",
		left: "3vw",
		height: "12vh",
		width: "36vh",
	},
	add_scenario_button: {
		height: "8vh",
		width: "20vw",
		borderRadius: 9,
		marginBottom: "4vh",
	},
	add_scenario_icon: {
		fontSize: "4vh",
		marginRight: "2vw",
	},
	box_modal: {
		position: "absolute",
		top: "15vh",
		left: "20vw",
		boxShadow: 24,
		backgroundColor: "white",
		borderRadius: 10,
		height: "80vh",
		width: "60vw",
		overflow: "scroll",
	},
	box_service_modal: {
		position: "absolute",
		top: "22vh",
		left: "25vw",
		boxShadow: 24,
		backgroundColor: "white",
		borderRadius: 10,
		minHeight: "35vh",
		width: "50vw",
	},
	modal_service_text: {
		fontSize: 25,
		marginTop: "5vh",
		marginLeft: "4vw",
	},
	modal_trigger_text: {
		fontSize: 25,
		marginTop: "1.5vh",
		marginLeft: "4vw",
	},
	modal_name_text: {
		fontSize: 25,
		marginTop: "5vh",
		marginLeft: "4vw",
	},
	service_modal_button: {
		marginTop: "2.5vh",
		marginLeft: "2.5vw",
	},
	service_modal_card: {
		height: "15vh",
	},
	select_modal: {
		marginTop: "2.5vh",
		marginLeft: "3.5vw",
		width: "50vw",
	},
	textfield_modal: {
		marginLeft: "3.5vw",
		width: "30vw",
		marginBottom: "1vh",
	},
	modal_params_action_text: {
		fontSize: 25,
		marginTop: "1.5vh",
		marginLeft: "4vw",
		marginBottom: "2vh",
	},
	modal_params_reaction_text: {
		fontSize: 25,
		marginTop: "1.5vh",
		marginLeft: "4vw",
	},
	button_validate: {
		position: "absolute",
		bottom: "1vh",
		right: "1vw",
	},
	params_list: {
		marginBottom: "2vh",
	},
	services_recap_modal: {
		display: "flex",
		flexDirection: "row",
		marginLeft: "4vw",
		marginTop: "3vh",
	},
	textfield_recap_modal: {
		marginLeft: "4vw",
		width: "30vw",
		marginBottom: "1vh",
		marginTop: "3vh",
	},
	arrow_recap_icon: {
		fontSize: "10vh",
		marginLeft: "2vw",
		marginRight: "2vw",
		marginTop: "2vh",
	},
	scenario_container: {
		marginTop: "25vh",
		marginLeft: "5vw",
		display: "flex",
		flexDirection: "column",
	},
	scenario_card: {
		height: "16vw",
		width: "55vw",
		marginBottom: "4vh",
		borderRadius: 10,
		display: "flex",
	},
	scenario_title: {
		fontSize: "2vw",
		marginTop: "2.5vh",
		marginBottom: "1vw",
		marginLeft: "2vw",
	},
	action_scenario_logo: {
		width: "6vw",
	},
	arrow_scenario_icon: {
		fontSize: "6vw",
		marginLeft: "2vw",
		marginRight: "2vw",
		marginTop: "2vh",
	},
	scenario_content: {
		marginLeft: "2vw",
	},
	scenario_logo: {
		width: "15vw",
	},
	scenario_left_container: {
		marginRight: "2vw",
	},
	delete_scenario_button: {
		marginLeft: "-8vw",
		marginTop: "2vh",
		height: "6vh",
		color: colors.RED,
	},
	delete_scenario_icon: {
		fontSize: "3vw",
	},
	scenario_card_container: {
		display: "flex",
		flexDirection: "row",
	},
	return_values_list: {
		display: "flex",
		flexDirection: "row",
		marginLeft: "4vw",
		marginBottom: "1vh",
	},
	return_value_text: {
		fontSize: "1.5vw",
		marginRight: "1vw",
		color: colors.GREY,
	},
	service_list: {
		marginRight: "2vw",
		marginBottom: "2vh",
	},
};

export default HomePage;
