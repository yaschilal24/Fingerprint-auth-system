
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

// Run a SQL query
export const query = (text, params = []) => {
  return pool.query(text, params);
};

// Get a PostgreSQL client for transactions
export const getClient = async () => {
  return pool.connect();
};

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    console.log(
      "PostgreSQL connected successfully:",
      result.rows[0].current_time
    );

    return true;
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
    return false;
  }
};

// Close database connection
export const closeDatabaseConnection = async () => {
  await pool.end();
  console.log("PostgreSQL connection closed.");
};

export default pool;
