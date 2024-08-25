import express from 'express';
import { PORT } from './config.js';
import { health } from './health.js';

const app = express();

app.get('/health', health);

app.listen(PORT, () => {
  console.log('hello');
  console.log(`Server running at ${PORT}`);
});
