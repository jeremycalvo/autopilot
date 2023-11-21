import axios from 'axios';
import * as urls from '../constants/network';

export const api_secret_page = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://' + urls.backUrl + '/secret-page', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};