import conn from "../db.js";

export const editProfile = async (req, res) => {
    try {
        const { field, value } = req.body;
        const userId = req.user?.userId;

        if (!userId || !field) {
            return res.status(400).json({ message: "Missing user ID or field name" });
        }

        const query = `UPDATE student SET ${field} = ? WHERE stud_id = ?`; // ✅ dynamic field
        const [result] = await conn.query(query, [value, userId]);

        return res.status(200).json({ message: `${field} updated successfully` });

    } catch (error) {
        console.error("Edit profile error:", error);
        return res.status(500).json({ message: "Server error while updating profile" });
    }
};

export const addProject = async (req, res) => {
    const { name, description, requestedAmount, stud_id } = req.body;

    try {
        const [stud] = await conn.query("SELECT * from student where stud_id = ?", [stud_id])
        if (stud.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        const [result] = await conn.query(
            "INSERT INTO projects (name, description, stud_id, requested_amount ) VALUES (?, ?, ?, ?)",
            [name, description, stud_id, requestedAmount]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error("Error adding project:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const myProjects = async (req, res) => {
    const { stud_id } = req.body;

    try {
        const [stud] = await conn.query("SELECT * FROM student WHERE stud_id = ? ORDER BY stud_id DESC", [stud_id])
        if (stud.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        const [result] = await conn.query(
            "SELECT * FROM projects WHERE stud_id = ?",
            [stud_id]
        );
        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding project:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await conn.query("SELECT * FROM projects WHERE project_id = ?", [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(result[0]); // Send a single object, not an array
    } catch (error) {
        console.error("Error fetching project by ID:", error);
        res.status(500).json({ message: "Server error" });
    }

}

export const editProjectById = async (req, res) => {
    const { id } = req.params;
    const { name, description, requested_amount } = req.body;

    try {
        const [result] = await conn.query(
            "UPDATE projects SET name = ?, description = ?, requested_amount = ? WHERE project_id = ?",
            [name, description, requested_amount, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getStudents = async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT * FROM student");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const fundingRequests = async (req, res) => {
    try {
        const stud_id = req.user?.userId;
        const [rows] = await conn.query(
            "SELECT request.*, c.company_name, p.name as project_name, p.description as project_description, p.requested_amount, s.name as student_name, s.stud_id as student_id, meeting.* FROM `project_funding_requests` as request LEFT JOIN meetings as meeting ON request.id = meeting.funding_request_id INNER JOIN company c ON c.company_id = request.company_id INNER JOIN projects as p ON p.project_id = request.project_id INNER JOIN student as s ON s.stud_id = p.stud_id WHERE request.status = 'pending' AND s.stud_id = ?", [stud_id]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching funding requests:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const approveFundingRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        // Get the selected request
        const [selectedRows] = await conn.query("SELECT * FROM project_funding_requests WHERE id = ?", [requestId]);
        if (selectedRows.length === 0) return res.status(404).json({ message: "Request not found" });

        const selected = selectedRows[0];
        const amount = selected.negotiated_amount || selected.amount;

        // Approve the selected request
        await conn.query("UPDATE project_funding_requests SET status = 'approved' WHERE id = ?", [requestId]);

        await conn.query("UPDATE projects SET status = 'funded', company_id = ?, approved_amount=? WHERE project_id = ?", [selected.company_id, amount, selected.project_id]);

        // Reject all other requests for same project
        await conn.query("UPDATE project_funding_requests SET status = 'rejected' WHERE project_id = ? AND id != ?", [selected.project_id, requestId]);

        return res.status(200).json({ message: "Request approved and others rejected" });
    } catch (error) {
        console.error("Error approving request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const rejectFundingRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        await conn.query("UPDATE project_funding_requests SET status = 'rejected' WHERE id = ?", [requestId]);
        return res.status(200).json({ message: "Request rejected" });
    } catch (error) {
        console.error("Error rejecting request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const negotiateFundingRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        // Get the selected request
        const [selectedRows] = await conn.query("SELECT * FROM project_funding_requests WHERE id = ?", [requestId]);
        if (selectedRows.length === 0) return res.status(404).json({ message: "Request not found" });

        await conn.query("UPDATE project_funding_requests SET negotiate = 1 WHERE id = ?", [requestId]);

        return res.status(200).json({ message: "Funding request updated for negotiation" });
    } catch (error) {
        console.error("Error negotiating funding request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}