const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

connectDB();
const app = express();

app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/events", require("./routes/events.routes"));
app.use("/api/tickets", require("./routes/tickets.routes"));
app.use("/api/checkin", require("./routes/checkin.routes"));

app.get("/", (req, res) => res.json({ msg: "Smart Ticketing API is up" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

module.exports = app;
