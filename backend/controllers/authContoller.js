import conn from "../db.js"; // import your MySQL connection pool
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

export const validateToken = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        console.log("Decoded token:", decoded);

        // Access the userType
        const userType = decoded.userType;

        if (!userType) {
            return res.status(403).json({ valid: false, message: 'userType missing in token' });
        }


        return res.status(200).json({
            valid: true,
            user: decoded,
            message: `Authenticated ${userType}`,
            userType: userType,
        });
    } catch (err) {
        console.error("Token validation error:", err);
        return res.status(401).json({ valid: false, message: 'Invalid or expired token', token: token, error: err.message });
    }
}

export const signUp = async (req, res) => {
    try {
        const { name, email, password, type } = req.body;

        if (type === "student") {
            const [existingStudent] = await conn.query("SELECT * FROM student WHERE email = ?", [email]);
            if (existingStudent.length > 0) {
                return res.status(400).json({ message: "Student already exists" });
            }

            await conn.query("INSERT INTO student (name, email, password) VALUES (?, ?, ?)", [name, email, password]);

            res.status(201).json({ message: "Student signed up successfully" });
        }

        // COMPANY SIGNUP
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

export const signIn = async (req, res) => {
    try {
        const { email, password, type } = req.body;

        if (type === "student") {
            const [rows] = await conn.query("SELECT * FROM student WHERE email = ? AND password = ?", [email, password]);
            if (rows.length === 0) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const user = rows[0];  // ✅ this is the actual user object

            const token = jwt.sign(
                {
                    email: user.email,
                    name: user.name,
                    userType: type,
                    userId: user.stud_id,  // ✅ correctly added now
                },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ status: 200, token: token, message: "Student signed in successfully", userDetails: user, userType: "student" });
        }

        // COMPANY SIGNIN
        const [user] = await conn.query("SELECT * FROM company WHERE email = ? AND password = ?", [email, password]);
        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        user = user[0];
        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                userType: type,
                userId: user.company_id,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ status: 200, token: token, message: "Company signed in successfully", userDetails: user[0], userType: "company" });

    } catch (error) {
        console.error("Error signing in company:", error);
        res.status(500).json({ message: "Server Error" });
    }
}