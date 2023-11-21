import axios from 'axios';
import * as urls from "../constants/network"

export const api_login = async (data) => {
  try {
    const response = await axios.post('http://' + urls.backUrl + '/login', data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const discord_login = async (code) => {
  try {
    const response = await axios.post('http://' + urls.backUrl + '/discord-login', code);
    return response.data;
  } catch (err) {
    throw err;
  }
};