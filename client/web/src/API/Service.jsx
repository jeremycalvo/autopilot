import axios from 'axios';
import * as urls from '../constants/network';

export const api_service_connection = async (code, service) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://' + urls.backUrl + '/services/' + service + '/auth', {
      params: code,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const api_service_list = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://' + urls.backUrl + '/services', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}