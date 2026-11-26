export function getAllowedFrontendOrigins(
  frontendOrigin: string,
  nodeEnv: string
): Set<string> {
  const origins = new Set([frontendOrigin]);
  if (nodeEnv === "development") {
    origins.add("http://localhost:3001");
  }
  return origins;
}

export function isAllowedFrontendOrigin(
  origin: string,
  allowedOrigins: Set<string>
): boolean {
  return allowedOrigins.has(origin);
}
