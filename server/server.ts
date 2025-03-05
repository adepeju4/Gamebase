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

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);

process.env.NODE_ENV === "production" &&
  app.use(
    "/build",
    express.static(path.join(path.dirname(__filename), "../build"))
  );

app.get("/", (_: Request, res: Response) => {
  return res
    .status(200)
    .sendFile(path.join(path.dirname(__filename), "../index.html"));
});

app.use("/Api", router);

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
startDB(); // starting mongodb database
app.listen(3000, () => console.log('listening on port ' + 3000)); //listens on port 3000 -> http://localhost:3000/
