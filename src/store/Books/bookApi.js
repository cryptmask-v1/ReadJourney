import axios from "axios";

const API_URL = "https://readjourney.b.goit.study/api";

export async function getRecommendedBooks(title, author, page = 1, limit = 10) {
  const params = { page, limit };
  if (title) {
    params.title = title;
  }
  if (author) {
    params.author = author;
  }
  try {
    const response = await axios.get(`${API_URL}/books/recommend`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function addBook(params) {
  try {
    const response = await axios.post(`${API_URL}/books/add`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function addBookFromRecommended(id) {
  try {
    const response = await axios.post(`${API_URL}/books/add/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function deleteBookFromUser(id) {
  try {
    const response = await axios.delete(`${API_URL}/books/remove/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function getUserBooks(status = "") {
  try {
    const params = {};
    if (status) {
      params.status = status;
    }
    const response = await axios.get(`${API_URL}/books/own`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function startReadingBook(params) {
  try {
    const response = await axios.post(`${API_URL}/books/reading/start`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function finishReadingBook(params) {
  try {
    const response = await axios.post(
      `${API_URL}/books/reading/finish`,
      params
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function deleteReadingBook(params) {
  try {
    const response = await axios.delete(`${API_URL}/books/reading`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

export async function getBookInfo(id) {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}
