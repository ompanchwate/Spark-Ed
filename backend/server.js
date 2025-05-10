import express from "express";
import cors from "cors"; // import cors
import RegisterRoutes from "./routes/registerRoutes.js";

const app = express();
const port = 3001;

// Enable CORS for all routes and origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Use the registration routes
app.use("/api", RegisterRoutes);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
