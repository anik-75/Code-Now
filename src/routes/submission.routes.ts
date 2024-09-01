import { Router } from 'express';
import {
  getSubmission,
  submitCode,
} from '../controllers/submissionController.js';
import { authMiddleWare } from '../middlewares/authMiddleware.js';

const submissionRouter = Router();

submissionRouter.post('/submissions', authMiddleWare, submitCode);
submissionRouter.get('/:submissionId', authMiddleWare, getSubmission);

export default submissionRouter;
