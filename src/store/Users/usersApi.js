import axios from "axios";

const API_URL = "https://readjourney.b.goit.study/api";

// Function adını değiştir: fetchUsers -> getCurrentUser
export async function getCurrentUser(token) {
  try {
    const response = await axios.get(`${API_URL}/users/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}
