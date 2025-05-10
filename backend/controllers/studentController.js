import conn from "../db.js";


export const signUpStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const [existingStudent] = await conn.query("SELECT * FROM student WHERE email = ?", [email]);
        if (existingStudent.length > 0) {
            return res.status(400).json({ message: "Student already exists" });
        }

        await conn.query("INSERT INTO student (name, email, password) VALUES (?, ?, ?)", [name, email, password]);

        res.status(201).json({ message: "Student signed up successfully" });

    } catch (error) {
        console.error("Error signing up student:", error);
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