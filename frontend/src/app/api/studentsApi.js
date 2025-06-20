import axios from "axios";
import { API } from "./api";


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

export const editProjectById = async (id, data, token) => {
    try {
        const response = await API.put(`/student/editproject/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while editing project by ID", error);
        throw error;
    }
}

export const editStudProfile = async(data, token) => {
    try {
        const response = await API.put("/student/editprofile", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while editing student profile", error);
        throw error;
    }
}