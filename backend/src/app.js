import express from "express";
import refactorRoutes from "./routes/refactorRoutes.js";

const app = express();
app.use(express.json());


app.use("/api", refactorRoutes);

export default app;
