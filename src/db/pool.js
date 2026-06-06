import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,                 // total connections the pool can open
  idleTimeoutMillis: 10000, // close idle connections after 10s
  connectionTimeoutMillis: 5000 // fail fast if DB is unreachable
});

export default pool;
