import axios from "axios";

// Base URL of your backend server
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const validateToken = async (token) => {
  try {
    const res = await API.get('/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return { valid: false, error: error.response?.data?.message || 'Invalid token' };
  }
};

export const signUpUser = async (data) => {
  try {

    const response = await API.post("/signup", data);
    return response.data;
  } catch (error) {
    console.error("❌ Error during sign up:", error);
    throw error;
  }
}

export const signInUser = async (data) => {
  try {
    const response = await API.post("/signin", data);
    return response.data;

  } catch (error) {
    console.error("❌ Error during sign up:", error);
    throw error;
  }
}

