import express from "express";

import  handleRefactorRequest  from "../controllers/refactorController.js";

const router = express.Router();

router.get("/model", handleRefactorRequest);

export default router;
