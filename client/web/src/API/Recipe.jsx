import axios from "axios";
import * as urls from "../constants/network"

export const api_recipe = async () => {
	const token = localStorage.getItem("token");
	try {
		const response = await axios.get("http://" + urls.backUrl + "/recipe", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};

export const api_recipe_list = async () => {
	const token = localStorage.getItem("token");
	try {
		const response = await axios.get("http://" + urls.backUrl + "/recipe/list", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};
