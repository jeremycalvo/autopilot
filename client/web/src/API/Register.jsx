import axios from 'axios';
import * as urls from '../constants/network';

export const api_register = async (data) => {
  try {
    const response = await axios.post('http://' + urls.backUrl + '/register', data);
    return response.data;
  } catch (err) {
    throw err;
  }
};