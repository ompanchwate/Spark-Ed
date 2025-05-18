import conn from "../db.js";


export const addProject = async (req, res) => {
    const { name, description, requestedAmount, stud_id } = req.body;

    try {
        const [stud] = await conn.query("SELECT * from Student where stud_id = ?", [stud_id])
        if (stud.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        const [result] = await conn.query(
            "INSERT INTO project (name, description, stud_id, requested_amount ) VALUES (?, ?, ?, ?)",
            [name, description, stud_id,  requestedAmount]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error("Error adding project:", error);
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