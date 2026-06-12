import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const router = express.Router();

/**
 * Security HTTP headers
 */
router.use(helmet());

/**
 * Enable CORS
 * You can restrict origin in production
 */
router.use(
  cors({
    origin: "*", // change this in production
    credentials: true,
  }),
);

/**
 * Compress responses
 */
router.use(compression());

/**
 * Logging (only in dev usually)
 */
router.use(morgan("dev"));

/**
 * Rate limiting (basic anti-abuse protection)
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // max requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

/**
 * Body parsers
 */
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/**
 * Test route
 */
router.get("/", (req, res) => {
  res.json({ message: "API is running safely 🚀" });
});

export default router;
