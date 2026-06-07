import express from "express";
import cors from "cors";
import testDBRoutes from "./routes/testDB.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://augura-fe.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);


app.use(express.json());
app.use(testDBRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Augura backend is running");
});

export default app;
