import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {enhanceJobDescription, enhanceProfessionalSummary, updateResume} from "../controllers/aiController.js"

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/update-reseum', protect, updateResume);

export default aiRouter;

