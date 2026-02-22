import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import http from 'http';
import router from './routes/index.js';
import startDB from './database/db.js';
import { initializeSocket } from './socket/index.js';

dotenv.config();

interface ErrorObject {
  log?: string;
  status?: number;
  message?: { err: string };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Socket.io
initializeSocket(server);

// API routes
app.use('/Api', router);

// Serve index.html for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  app.get('/', (_: Request, res: Response) => {
    return res.status(200).json({ message: 'API is running' });
  });
}

// 404 handler
app.use((_: Request, res: Response) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err: ErrorObject, _: Request, res: Response, __: NextFunction) => {
  const defaultErr: ErrorObject = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign({}, defaultErr, err);

  let errorMessage = errorObj.message;
  if (typeof errorMessage === 'string') {
    errorMessage = { err: errorMessage };
  } else if (Array.isArray(errorMessage)) {
    errorMessage = { err: errorMessage.join(', ') };
  } else if (!errorMessage || typeof errorMessage !== 'object') {
    errorMessage = { err: 'An unknown error occurred' };
  }

  console.error('SERVER ERROR:', { log: errorObj.log, message: errorMessage });

  return res.status(errorObj.status || 500).json({
    success: false,
    error: errorMessage.err,
  });
});

// Connect to DB and start server
startDB();

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Vercel serverless functions
export default app;
