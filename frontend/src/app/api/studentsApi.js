import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3001/api", // make sure port matches your Express server
    headers: {
        "Content-Type": "application/json",
    },
});

export const addProject = async (data, token) => {
    try {
        const response = await API.post("/student/addproject", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while adding the project", error);
        throw error;
    }
}

export const myProjects = async (data, token) => {
    try {
        const response = await API.post("/student/myproject", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response;
    } catch (error) {
        console.error("❌ Error while adding the project", error);
        throw error;
    }
}

export const getProjectById = async (id, token) => {
    try {
        const response = await API.get(`/student/myproject/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while fetching project by ID", error);
        throw error;
    }
}