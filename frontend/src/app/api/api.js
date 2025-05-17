import axios from "axios";

// Base URL of your backend server
const API = axios.create({
    baseURL: "http://localhost:3001/api", // make sure port matches your Express server
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
    console.log("res", res)
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
