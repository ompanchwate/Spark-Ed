import { API } from "./api";


export const allProjects = async (token) => {
    try {
        const response = await API.get("/company/allprojects", {
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

export const editCompanyProfile = async (data, token) => {
    try {
        const response = await API.put("/company/editprofile", data, {
            headers: {
                authorization: `Bearer ${token}`,
            }
        });

        return response;
    } catch (error) {
        console.error("❌ Error while editing the company profile", error);
        throw error;
    }
}

export const createScholarship = async (data, token) => {
    try {
        const response = await API.post("/company/createscholarship", data, {
            headers: {
                authorization: `Bearer ${token}`,
            }
        });

        return response;
    } catch (error) {
        console.error("❌ Error while creating the scholarship", error);
        throw error;
    }
}

export const companyScholarships = async (token) => {
    try {
        const response = await API.get("/company/getscholarships", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response;
    } catch (error) {
        console.error("❌ Error while fetching company scholarships", error);
        throw error;
    }
}

export const getProjectByIdForCompany = async (id, token) => {
    try {
        const response = await API.get(`/company/get-project/${id}`, {
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

export const fundProject = async (data, token) => {
    try {
        const response = await API.post("/company/fund-project", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response;
    } catch (error) {
        console.error("❌ Error while funding the project", error);
        throw error;
    }
}


export const getNegotiationRequest = async (token) => {
    try {
        const response = await API.get("/company/getnegotiation-requests", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while fetching funding requests", error);
        throw error;
    }
}

export const scheduleMeetForNegotiation = async (data, token) => {
    try {
        const response = await API.post("/company/create-meet", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while fetching funding requests", error);
        throw error;
    }
}

export const markMeetingAsCompleted = async (data, token) => {
    try {
        const response = await API.post("/company/markcompleted", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while marking meeting as completed", error);
        throw error;
    }
}
export const submitUpdatedOffer = async (data, token) => {
    try {
        const response = await API.post("/company/submit-updated-offer", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error while submitting updated offer", error);
        throw error;
    }
}