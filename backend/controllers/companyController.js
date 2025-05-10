import conn from "../db.js"; // import your MySQL connection pool

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
    try{
        const { name, email, password } = req.body;

        // Check if the company already exists
        const [existingCompany] = await conn.query("SELECT * FROM company WHERE email = ?", [email]);
        if (existingCompany.length > 0) {
            return res.status(400).json({ message: "Company already exists" });
        }

        await conn.query("INSERT INTO company (company_name, email, password) VALUES (?, ?, ?)", [name, email, password]);

        res.status(201).json({ message: "Company signed up successfully" });

    }catch (error) {
        console.error("Error signing up company:", error);
        res.status(500).json({ message: "Server Error" });
    }
}