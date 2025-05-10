import axios from "axios";

// Base URL of your backend server
const API = axios.create({
    baseURL: "http://localhost:3001/api", // make sure port matches your Express server
    headers: {
        "Content-Type": "application/json",
    },
});

export const signUpUser = async (data, type) => {
    try {
        console.log(data, type)
        if (type === "company") {
            const response = await API.post("/signup/company", data);
            return response.data;
        }

        const response = await API.post("/signup/student", data);
        return response.data;


    } catch (error) {
        console.error("❌ Error during sign up:", error);
        throw error;
    }
}

// Example: Fetch companies
export const fetchCompanies = async () => {
    try {
        const response = await API.get("/getcompanies");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching companies:", error);
        throw error;
    }
};


// Add more API functions here as needed
// export const createCompany = (data) => API.post("/addCompany", data);
