/**
 * GET : /books/recommend ---- get recommended books
 * POST : /books/add ---- add a new book
 * POST : /books/add/:id ---- add a new book from recommended books
 * DELETE : /books/remove/:id ---- delete users book
 * GET : /books/own ---- get users own books
 * POST : /books/reading/start ---- save the start of reading the book
 * POST : /books/reading/finish ---- save the finish of reading the book
 * DELETE : /books/reading ---- delete the reading of the book
 * GET : /books/:id ---- get info about the book
 */

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

/**
 * request body {
 *   title: string,
 *   author: string,
 *   totalPages: string,
 * }
 */
export async function addBook(params) {
  try {
    const response = await axios.post(`${API_URL}/books/add`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}
// REQUEST BODY {
//   id: string
// }

export async function addBookFromRecommended(id) {
  try {
    const response = await axios.post(`${API_URL}/books/add/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

// REQUEST BODY {
//   id: string
// }

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

// request body {
//   id: string
//   page: number (current page of the book)
// }

export async function startReadingBook(params) {
  try {
    const response = await axios.post(`${API_URL}/books/reading/start`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

// request body {
//   id: string
//   page: number (current page of the book)
// }

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

// request body {
//   bookiId: string
//   readingId: string(current page of the book)
// }

export async function deleteReadingBook(params) {
  try {
    const response = await axios.delete(`${API_URL}/books/reading`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}

// GET : /books/:id ---- get info about the book,

export async function getBookInfo(id) {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}
