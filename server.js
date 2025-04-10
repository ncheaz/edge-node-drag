import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/routes.js";
import { createServer } from "http";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import { COOKIE_NAME } from "./utils/constants.js";
import { Server } from "socket.io";
import { initializeSockets } from "./services/streamingService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.SERVER_PORT || 5000;
const app = express();
const httpServer = createServer(app);

export const socketService = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

initializeSockets();

app.use(cookieParser());

const requestMiddleware = (req, res, next) => {
  const sessionId = req.cookies[COOKIE_NAME];

  if (sessionId) {
    // Store the session ID in the request object for later use
    req.sessionSid = sessionId;
    logger.info("Captured session ID:" + sessionId);
  } else {
    logger.info("No session.sid cookie found");
  }

  next();
};

// app.use(
//   cors({
//     credentials: true,
//     origin: (origin, callback) => callback(null, origin),
//   })
// );

const allowedOrigins = [
  "http://localhost:8100",
  "http://localhost:5173",
  process.env.UI_ENDPOINT,
];

// CORS configuration function
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(requestMiddleware);
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method}: ${req.url} request received`);

  return next();
});

app.use(process.env.ROUTES_PREFIX || "/", routes);

httpServer.listen(PORT, () => {
  logger.info(`ChatDKG Server is running on http://localhost:${PORT}`);
});
