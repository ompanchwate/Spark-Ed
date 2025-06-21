import express from "express";
import cors from "cors"; // import cors
import RegisterRoutes from "./routes/registerRoutes.js";
import StudentRoutes from "./routes/studentRoutes.js";
import CompanyRoutes from "./routes/companyRoutes.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/", (req, res) => {
  res.send("Welcome to the Spark Ed API");
})
app.use("/api", RegisterRoutes);
app.use("/api/student", StudentRoutes)
app.use("/api/company", CompanyRoutes)


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
