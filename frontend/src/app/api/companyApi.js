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
