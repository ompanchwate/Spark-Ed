import express from "express";
import cors from "cors";
import RegisterRoutes from "./routes/registerRoutes.js";
import StudentRoutes from "./routes/studentRoutes.js";
import CompanyRoutes from "./routes/companyRoutes.js";

const app = express();
const port = process.env.PORT || 3001; // Use env PORT for deployment

app.use(cors());
app.use(express.json());

// Only for GET on root path
app.get("/", (req, res) => {
  res.send("Welcome to the Spark Ed API");
});

// API routes
app.use("/api", RegisterRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/company", CompanyRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
