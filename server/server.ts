import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import router from "./routes/index.js";
import startDB from "./database/db.js";

interface ErrorObject {
  log?: string;
  status?: number;
  message?: { err: string };
}

// Initialize dotenv before creating the app
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
}

// API routes
app.use("/Api", router);

// Serve index.html for all other routes in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (_: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
} else {
  app.get("/", (_: Request, res: Response) => {
    return res.status(200).json({ message: "API is running" });
  });
}

// Unknown route handler
app.use((_: Request, res: Response) => res.status(404).send({ message: "Route not found" }));

// Global error handler
app.use((err: ErrorObject, _: Request, res: Response, __: NextFunction) => {
  const defaultErr: ErrorObject = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(err, errorObj.log, errorObj.message);
  return res.status(errorObj.status || 500).json(errorObj.message);
});

console.log('current state of node environment is -> ', process.env.NODE_ENV);

// Connect to database
startDB();

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

// For Vercel serverless functions
export default app;
