import conn from "../db.js"; // import your MySQL connection pool
import jwt from "jsonwebtoken";
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

export const signUpCompany = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the company already exists
        const [existingCompany] = await conn.query("SELECT * FROM company WHERE email = ?", [email]);
        if (existingCompany.length > 0) {
            return res.status(400).json({ message: "Company already exists" });
        }

        await conn.query("INSERT INTO company (company_name, email, password) VALUES (?, ?, ?)", [name, email, password]);

        res.status(201).json({ message: "Company signed up successfully" });

    } catch (error) {
        console.error("Error signing up company:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const signInCompany = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the company exists
        const [company] = await conn.query("SELECT * FROM company WHERE email = ? AND password = ?", [email, password]);
        if (company.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: company.company_id, email: company.email }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ status: 200, token: token, message: "Company signed in successfully", company: company[0] });

    } catch (error) {
        console.error("Error signing in company:", error);
        res.status(500).json({ message: "Server Error" });
    }
}


export const allProjects = async (req, res) => {
    try {
        const [projects] = await conn.query("SELECT * FROM projects");
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Server Error" });
    }
}
