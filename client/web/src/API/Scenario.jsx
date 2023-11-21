import axios from "axios";
import * as urls from "../constants/network"

export const api_scenario = async (action, reaction, name) => {
	const token = localStorage.getItem("token");
    let data = {
        action: action,
        reaction: reaction,
        name: name
    }
	try {
		const response = await axios.put("http://" + urls.backUrl + "/recipe/add", data, {
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
	const token = localStorage.getItem("token");
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
