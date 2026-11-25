import mysql, {
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";
import { config } from "./config";

export type SqlValue = string | number | boolean | Date | Buffer | null;

export const pool = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  charset: "utf8mb4",
});

export async function rows<T extends RowDataPacket[]>(
  sql: string,
  values: SqlValue[] = []
): Promise<T> {
  const [result] = await pool.execute<T>(sql, values);
  return result;
}

export async function execute(
  sql: string,
  values: SqlValue[] = []
): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(sql, values);
  return result;
}

export async function beginTransaction(): Promise<PoolConnection> {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
}

export async function closePool(): Promise<void> {
  await pool.end();
}
