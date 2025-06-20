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
        const [stud] = await conn.query("SELECT * from Student where stud_id = ?", [stud_id])
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
        const [stud] = await conn.query("SELECT * from Student where stud_id = ?", [stud_id])
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