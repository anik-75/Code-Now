import { Router } from 'express';
import {
  getSubmissionById,
  getSubmissions,
  submitCode,
} from '../controllers/submissionController.js';
import { authMiddleWare } from '../middlewares/authMiddleware.js';

const submissionRouter = Router();

submissionRouter.get('/:problemId', authMiddleWare, getSubmissions);
submissionRouter.get('/:submissionId', authMiddleWare, getSubmissionById);

export default submissionRouter;
