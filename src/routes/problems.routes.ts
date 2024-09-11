import { Router } from 'express';
import { authMiddleWare } from '../middlewares/authMiddleware.js';
import { checkAdmin } from '../middlewares/checkAdminMiddleware.js';
import {
  createProblem,
  removeProblem,
  getProblem,
  updateProblem,
  getAllProblems,
} from '../controllers/problemController.js';
import { runCode, submitCode } from '../controllers/submissionController.js';

const problemRouter = Router();

problemRouter.post('/', authMiddleWare, checkAdmin, createProblem);
problemRouter.put('/:problemId', authMiddleWare, checkAdmin, updateProblem);
problemRouter.get('/:problemId', authMiddleWare, getProblem);
problemRouter.delete('/:problemId', authMiddleWare, checkAdmin, removeProblem);
problemRouter.post('/:problemId/submit', authMiddleWare, submitCode);
problemRouter.post('/:problemId/run', authMiddleWare, runCode);
problemRouter.get('/', getAllProblems);

export default problemRouter;
