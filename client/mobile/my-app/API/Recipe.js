import axios from "axios";
import * as urls from "../constants/network"
import { AsyncStorage } from 'react-native';

export const api_recipe = async () => {
	const token = AsyncStorage.getItem("token");
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
	const token = await AsyncStorage.getItem("token");
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

export const api_recipe_delete = async (id) => {
	const token = await AsyncStorage.getItem("token");
	console.log("ok")
	let data = {
		id: id
	}
	try {
		const response = await axios.delete("http://" + urls.backUrl + "/recipe/remove", {
			params: data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	}
	catch (err) {
		throw err;
	}
};
