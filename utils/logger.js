import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

console.log("NODE_ENV:", process.env.NODE_ENV);

// Define log format
const logFormat = format.combine(
  format.splat(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.simple(),
  format.printf(
    (info) =>
      `${info.timestamp} | ${info.level.toUpperCase().padEnd(5)} | ${
        info.message
      }`
  )
);

// Create a logger instance
const logger = createLogger({
  format: logFormat,
  transports: [
    new transports.DailyRotateFile({
      filename: "logs/error.log",
      level: "error",
      frequency: "7d",
      maxSize: "20m",
      maxFiles: "365d",
      zippedArchive: true,
    }),
    new transports.DailyRotateFile({
      filename: "logs/info.log",
      level: "info",
      frequency: "7d",
      maxSize: "20m",
      maxFiles: "365d",
      zippedArchive: true,
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "PRODUCTION") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export default logger;
