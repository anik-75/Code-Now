import express, { Request, Response } from 'express';
import { PORT } from './config.js';
import { health } from './health.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import submissionRouter from './routes/submission.routes.js';
import problemRouter from './routes/problems.routes.js';
import path, { dirname } from 'path';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/health', health);
app.use('/api/users', userRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/problems', problemRouter);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const parentDir = path.resolve(__dirname, '..');
const distPath = path.join(parentDir, 'dest');

// Serve static files from the build folder
app.use(express.static(distPath));

// Serve the index.html file for all non-static requests
app.get('*', (_req, res) => {
  const filePath = path.join(distPath, 'index.html');
  res.sendFile(filePath);
});

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
