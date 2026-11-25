import { randomUUID } from "node:crypto";
import type { PoolConnection } from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";

export async function resolveSkillId(
  connection: PoolConnection,
  name: string
): Promise<string> {
  const cleanName = name.trim().replace(/\s+/g, " ").slice(0, 100);
  const normalizedName = cleanName.toLocaleLowerCase("en-US");
  const [existing] = await connection.execute<RowDataPacket[]>(
    "SELECT id FROM skills WHERE normalized_name = ? LIMIT 1",
    [normalizedName]
  );
  if (existing[0]) return String(existing[0].id);

  const id = randomUUID();
  try {
    await connection.execute(
      "INSERT INTO skills (id, name, normalized_name) VALUES (?, ?, ?)",
      [id, cleanName, normalizedName]
    );
    return id;
  } catch (error) {
    if ((error as { code?: string }).code !== "ER_DUP_ENTRY") throw error;
    const [raced] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM skills WHERE normalized_name = ? LIMIT 1",
      [normalizedName]
    );
    if (!raced[0]) throw error;
    return String(raced[0].id);
  }
}

export function normalizeSkillNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().replace(/\s+/g, " ").slice(0, 100))
      .filter(Boolean)
      .map((item) => item.toLocaleLowerCase("en-US"))
  )];
}

export function skillMatchPercent(required: string[], candidate: string[]): number {
  if (required.length === 0) return 100;
  const candidateSkills = new Set(candidate.map((skill) => skill.toLocaleLowerCase("en-US")));
  const matches = required.filter((skill) => candidateSkills.has(skill.toLocaleLowerCase("en-US"))).length;
  return Math.round((matches / required.length) * 100);
}
