import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RowDataPacket } from "mysql2/promise";
import { closePool, execute, pool, rows } from "./db";

interface MigrationRow extends RowDataPacket {
  version: string;
}

async function migrate(): Promise<void> {
  await execute(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       version VARCHAR(180) NOT NULL PRIMARY KEY,
       applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );

  const migrationDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
  const files = (await readdir(migrationDirectory))
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  for (const file of files) {
    const alreadyApplied = await rows<MigrationRow[]>(
      "SELECT version FROM schema_migrations WHERE version = ? LIMIT 1",
      [file]
    );
    if (alreadyApplied.length) continue;

    const sql = await readFile(path.join(migrationDirectory, file), "utf8");
    const statements = sql.split(";").map((statement) => statement.trim()).filter(Boolean);
    for (const statement of statements) await pool.query(statement);
    await execute("INSERT INTO schema_migrations (version) VALUES (?)", [file]);
    console.info(`Applied migration ${file}`);
  }

  console.info("Database migrations are up to date.");
}

void migrate()
  .catch((error: unknown) => {
    console.error("Database migration failed:", error);
    process.exitCode = 1;
  })
  .finally(closePool);
