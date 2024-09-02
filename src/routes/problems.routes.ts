import { Router } from 'express';
import { authMiddleWare } from '../middlewares/authMiddleware.js';
import { checkAdmin } from '../middlewares/checkAdminMiddleware.js';
import {
  createProblem,
  removeProblem,
  getProblem,
  updateProblem,
} from '../controllers/problemController.js';

const problemRouter = Router();

problemRouter.post('/', authMiddleWare, checkAdmin, createProblem);
problemRouter.put('/:problemId', authMiddleWare, checkAdmin, updateProblem);
problemRouter.get('/:problemId', authMiddleWare, getProblem);
problemRouter.delete('/:problemId', authMiddleWare, checkAdmin, removeProblem);

export default problemRouter;
