import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import { rateLimit } from "express-rate-limit";
import { query, validationResult } from "express-validator";
import path from "path";
import { fileURLToPath } from "url";
import articleRoutes from "./routes/articleRoutes.js";
import { getMockArticles } from "./utils/mockNews.js";

dotenv.config();

// Ensure GNEWS_API_KEY exists on startup
if (!process.env.GNEWS_API_KEY) {
  throw new Error(
    "FATAL CONFIG ERROR: GNEWS_API_KEY environment variable is missing. " +
    "Please define it in news-backend/.env to start the server."
  );
}

const app = express();

// --- Server-side Cache Setup ---
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // Cache news results for 2 minutes

/**
 * Builds a unique cache key based on query filters.
 */
const getCacheKey = (query) => {
  const { country = "in", topic = "general", q = "", page = 1 } = query;
  return `${country}-${topic}-${q.trim().toLowerCase()}-${page}`;
};

// --- Rate Limiting Middleware ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please try again after 15 minutes.",
      limit: 100,
      windowMs: 15 * 60 * 1000
    });
  }
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Set up directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB Connection (Optional / Graceful Fail) ---
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newsapi";
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("⚠️ MongoDB connection error (optional features will be affected):", err.message));

// --- API Routes ---
app.use("/api/articles", articleRoutes);

// Allowed options for query param validation
const allowedCountries = ["us", "in", "gb", "au", "ca", "sg", "ie"];
const allowedTopics = ["general", "world", "nation", "business", "technology", "sports", "entertainment", "science", "health"];

// Fetch News Route with validation/sanitization, caching, and mock fallbacks
app.get(
  "/api/news",
  [
    query("country")
      .optional()
      .toLowerCase()
      .isIn(allowedCountries)
      .withMessage(`Invalid country code. Supported: ${allowedCountries.join(", ")}`),
    query("topic")
      .optional()
      .toLowerCase()
      .isIn(allowedTopics)
      .withMessage(`Invalid topic. Supported: ${allowedTopics.join(", ")}`),
    query("q")
      .optional()
      .trim()
      .escape(),
    query("max")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Max must be a number between 1 and 100")
      .toInt(),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt()
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { country = "in", topic = "general", q = "", max = 10, page = 1 } = req.query;
    const cacheKey = getCacheKey(req.query);

    // 1. Check Caching Layer
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION)) {
      console.log(`⚡ Cache hit: serving news for key [${cacheKey}]`);
      return res.json(cachedEntry.data);
    }

    try {
      // Build parameters for GNews API
      const params = {
        lang: "en",
        country,
        max,
        page,
        token: process.env.GNEWS_API_KEY,
      };

      if (topic) {
        params.topic = topic;
      }
      if (q) {
        params.q = q;
      }

      console.log(`🌐 Cache miss: requesting live GNews API data for key [${cacheKey}]`);
      const response = await axios.get("https://gnews.io/api/v4/top-headlines", { params });

      const responseData = {
        articles: response.data.articles || [],
        totalArticles: response.data.totalArticles || 0,
        page,
        max
      };

      // 2. Set Cache on success
      cache.set(cacheKey, {
        timestamp: Date.now(),
        data: responseData
      });

      res.json(responseData);
    } catch (err) {
      console.error("⚠️ GNews API error:", err.response?.data || err.message);
      console.warn("🔄 Automatically triggering mock news fallback database.");

      // 3. Graceful Mock news database fallback on error (quota limit/network down)
      const fallbackArticles = getMockArticles(topic, q);
      const fallbackData = {
        articles: fallbackArticles,
        totalArticles: fallbackArticles.length,
        page: 1,
        max,
        isMockFallback: true
      };

      // Set a short cache for mock data to prevent spamming failed API requests
      cache.set(cacheKey, {
        timestamp: Date.now(),
        data: fallbackData
      });

      res.json(fallbackData);
    }
  }
);

// --- Production Build Static Serving ---
const distPath = path.join(__dirname, "../news-frontend/dist");
app.use(express.static(distPath));

// Fallback to React index.html in production (using RegExp to avoid Express 5 PathError)
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // pass to API error handlers
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send(`
        <h1>📰 GNews API Server is running</h1>
        <p>Frontend static files serve ready in production build.</p>
        <p>API endpoints are available at: <code>/api/news</code></p>
      `);
    }
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
