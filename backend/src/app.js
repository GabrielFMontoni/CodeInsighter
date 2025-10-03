import cors from "cors";
import express from "express";
import refactorRoutes from "./routes/refactorRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", refactorRoutes);
app.use("/api/github", githubRoutes);

export default app;


