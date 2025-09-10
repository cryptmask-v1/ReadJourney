import axios from "axios";

const API_URL = "https://readjourney.b.goit.study/api";

export async function register(params) {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function login(params) {
  try {
    const response = await axios.post(`${API_URL}/users/signin`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function logout() {
  try {
    await axios.post(`${API_URL}/users/signout`);
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function refresh(token) {
  try {
    const response = await axios.get(`${API_URL}/users/current/refresh`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}
