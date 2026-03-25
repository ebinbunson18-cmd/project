require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create table if not exists
async function createTable() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully ");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Messages table is ready ");
  } catch (error) {
    console.error("Database setup error :", error);
  }
}

createTable();

// Home route
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully"
  });
});

// Contact form submit route
app.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.status(200).json({
      success: true,
      message: "Thanks for reaching out! I’ll get back to you soon."
    });

  } catch (error) {
    console.error("Error saving message :", error);

    res.status(500).json({
      success: false,
      message: "Oops! Something went wrong. Please try again later."
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});