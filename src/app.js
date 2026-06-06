import express from "express";
import cors from "cors";
import testDBRoutes from "./routes/testDB.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(testDBRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Augura backend is running");
});

export default app;
