import express from "express";
import cors from "cors"; // import cors
import RegisterRoutes from "./routes/registerRoutes.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", RegisterRoutes);


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
