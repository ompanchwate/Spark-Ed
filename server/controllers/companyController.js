import conn from "../db.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import { getAuthClient } from "../googleAuth.js";
dotenv.config(); // Load environment variables

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
        const [projects] = await conn.query("SELECT * FROM projects WHERE status = 'pending' OR status IS NULL");
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

export const getNegotiationRequest = async (req, res) => {
    try {
        const company_id = req.user?.userId;
        if (!company_id) {
            return res.status(400).json({ message: "Missing company ID" });
        }

        const [rows] = await conn.query(
            "SELECT request.*, p.name as project_name, p.description as project_description, p.requested_amount, s.name as student_name, s.stud_id as student_id, meeting.* FROM `project_funding_requests` as request LEFT JOIN meetings as meeting ON request.id = meeting.funding_request_id INNER JOIN projects as p ON p.project_id = request.project_id INNER JOIN student as s ON s.stud_id = p.stud_id WHERE request.negotiate = 1 AND request.company_id", [company_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching negotiation requests:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const createMeet = async (req, res) => {
    try {
        const { funding_request_id, date, time, summary } = req.body;

        if (!date || !time) {
            return res.status(400).json({ message: "Date and time are required" });
        }

        // Parse IST date & time (YYYY-MM-DD format expected)
        const [year, month, day] = date.split("-");
        const [hour, minute] = time.split(":");

        // Create date object in local time (IST if server is IST)
        const startDateIST = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute)
        );

        // Compute end time (+2 hours)
        const endDateIST = new Date(startDateIST.getTime() + 2 * 60 * 60 * 1000);

        // ✅ MySQL DATETIME format in IST
        const mysqlDateTime = startDateIST
            .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) // e.g. "2025-07-27 12:00:00"
            .replace("T", " ");

        // ✅ Convert IST to UTC ISO for Google Calendar
        const startUTC = new Date(startDateIST.getTime() - (5.5 * 60 * 60 * 1000));
        const endUTC = new Date(endDateIST.getTime() - (5.5 * 60 * 60 * 1000));

        const auth = await getAuthClient();
        const calendar = google.calendar({ version: "v3", auth });

        const event = {
            summary: summary || "Meeting",
            start: {
                dateTime: startUTC.toISOString(),
                timeZone: "Asia/Kolkata"
            },
            end: {
                dateTime: endUTC.toISOString(),
                timeZone: "Asia/Kolkata"
            },
            conferenceData: {
                createRequest: {
                    requestId: "meet-" + Date.now(),
                    conferenceSolutionKey: { type: "hangoutsMeet" }
                }
            }
        };

        // ✅ Create event in Google Calendar
        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1
        });

        // ✅ Save meeting in DB
        await conn.query(
            "INSERT INTO meetings (funding_request_id, summary, meet_link, date_time) VALUES (?, ?, ?, ?)",
            [funding_request_id, summary || "Meeting", response.data.hangoutLink, mysqlDateTime]
        );

        res.status(200).json({
            meetLink: response.data.hangoutLink,
            scheduledAt: mysqlDateTime
        });

    } catch (err) {
        console.error("Meet creation failed:", err);
        res.status(500).json({ message: "Failed to create Google Meet" });
    }
};

export const markCompleted = async (req, res) => {
    try {
        const { meetingId } = req.body;

        if (!meetingId) {
            return res.status(400).json({ message: "Funding request ID is required" });
        }
        console.log(meetingId)

        // Update the meeting status to completed
        await conn.query("UPDATE meetings SET meeting_status = 'completed' WHERE meeting_id = ?", [meetingId]);

        return res.status(200).json({ message: "Meeting marked as completed" });
    } catch (error) {
        console.error("Error marking meeting as completed:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const updateOffer = async (req, res) => {
    try {
        const { requestId, newAmount, comments } = req.body;

        if (!requestId || !newAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (comments.length > 0) {
            await conn.query(
                "UPDATE project_funding_requests SET negotiated_amount = ?, message = ? WHERE id = ?",
                [newAmount, comments, requestId]
            );
        } else {
            await conn.query("UPDATE project_funding_requests SET negotiated_amount = ? WHERE id = ?",
                [newAmount, requestId])
        }

        return res.status(200).json({ message: "Offer updated successfully" });
    } catch (error) {
        console.error("Error updating offer:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}