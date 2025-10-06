import express from "express";
import handleRefactorRequest, { handleFilesAnalyze, handleFilesRefactor, getMockPayload } from "../controllers/refactorController.js";

const router = express.Router();

router.get("/model", handleRefactorRequest);
router.post("/analyze/files", handleFilesAnalyze);
router.post("/refactor/files", handleFilesRefactor);
router.get("/mock", getMockPayload);

export default router;
