import conn from "../db.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

export const getCompanies = async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT * FROM company");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const allProjects = async (req, res) => {
    try {
        const [projects] = await conn.query("SELECT * FROM projects");
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const editProfile = async (req, res) => {
    try {
        const { field, value } = req.body;
        const userId = req.user?.userId;

        if (!userId || !field) {
            return res.status(400).json({ message: "Missing user ID or field name" });
        }

        const query = `UPDATE company SET ${field} = ? WHERE company_id = ?`; // ✅ dynamic field
        const [result] = await conn.query(query, [value, userId]);

        return res.status(200).json({ message: `${field} updated successfully` });

    } catch (error) {
        console.error("Edit profile error:", error);
        return res.status(500).json({ message: "Server error while updating profile" });
    }
};

export const createScholarship = async (req, res) => {
    try {
        const { name, description, amount, eligibility_criteria } = req.body;
        const company_id = req.user?.userId;
        console.log()

        const [rows] = await conn.query("INSERT INTO scholarships (name, description, amount, eligibility_criteria, company_id) VALUES (?, ?, ?, ?, ?)", [name, description, amount, eligibility_criteria, company_id]);

        return res.status(201).json({ message: "Scholarship created successfully", scholarshipId: rows.insertId });
    } catch (error) {
        console.error("Error creating scholarship:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getScholarship = async (req, res) => {
    try {
        const company_id = req.user?.userId;
        if (!company_id) {
            return res.status(400).json({ message: "Missing company ID" });
        }
        const [rows] = await conn.query(
            "SELECT s.*, c.company_name as company_name FROM scholarships s INNER JOIN company c ON s.company_id = c.company_id WHERE s.company_id = ?",
            [company_id]
        );

        console.log(rows)
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }

}

export const getProjectForCompany = async (req, res) => {
    try {
        const projectId = req.params.id;
        if (!projectId) {
            return res.status(400).json({ message: "Missing project ID" });
        }

        const [rows] = await conn.query("SELECT projects.*, student.name as stud_name, student.phone as phone FROM projects INNER JOIN student ON student.stud_id = projects.stud_id WHERE projects.project_id = ?", [projectId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const fundProject = async (req, res) => {
    try {
        const { projectId, amount, message } = req.body;
        const company_id = req.user?.userId;

        if (!projectId || !amount || !company_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the project exists
        const [project] = await conn.query("SELECT * FROM projects WHERE project_id = ?", [projectId]);
        if (project.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Insert funding record
        await conn.query("INSERT INTO  project_funding_requests (project_id, company_id, amount, message) VALUES (?, ?, ?, ?)", [projectId, company_id, amount, message]);

        return res.status(200).json({ message: "Project funded successfully" });
    } catch (error) {
        console.error("Error funding project:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};