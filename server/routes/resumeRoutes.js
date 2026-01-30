import express from 'express';
import protect from "../middlewares/authMiddleware.js"
import {CreateResume, DeleteResume, GetPublicResumeById, GetResumeById, UpdateResume} from "../controllers/resumeController.js"
import upload from "../configs/imageKit.js";
const resumeRouter = express.Router();

resumeRouter.post('/create', protect, CreateResume);
resumeRouter.put('/update', upload.single('image'), protect, UpdateResume);
resumeRouter.delete('/delete/:resumeId', protect, DeleteResume);
resumeRouter.get('/get/:resumeId', protect, GetResumeById);
resumeRouter.get('/public/:resmueId', protect, GetPublicResumeById);

export default resumeRouter;
