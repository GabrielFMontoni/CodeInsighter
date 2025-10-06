import cors from "cors";
import express from "express";
import refactorRoutes from "./routes/refactorRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import pipelineRoutes from "./routes/pipelineRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";


const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));


app.use("/api", refactorRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/pipeline", pipelineRoutes);

export default app;


