import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(__dirname, "db.pem")).toString(),
  },
});

export const getCurrentDeploymentId = async (
  subdomain: string
): Promise<string | null> => {
  try {
    const result = await pool.query(
      `SELECT "current_deployment_id" FROM "Project" WHERE "slug" = $1 LIMIT 1`,
      [subdomain]
    );
    return result.rows[0]?.current_deployment_id ?? null;
  } catch (err) {
    console.error("DB query error:", err);
    return null;
  }
};
