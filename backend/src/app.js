import cors from "cors";
import express from "express";
import refactorRoutes from "./routes/refactorRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", refactorRoutes);

export default app;


