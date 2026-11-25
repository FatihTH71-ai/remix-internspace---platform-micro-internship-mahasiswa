export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ path: string; message: string }>;
  };
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as ApiErrorBody | null;
    const message = body?.error?.message ?? `Request failed with status ${response.status}.`;
    const details = body?.error?.details ?? [];
    throw new ApiClientError(
      response.status,
      body?.error?.code ?? "REQUEST_FAILED",
      details.length > 0
        ? `${message} ${details.map((detail) => `${detail.path || "request"}: ${detail.message}`).join("; ")}`
        : message
    );
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export function apiJson<T>(
  path: string,
  method: "POST" | "PATCH" | "PUT",
  body: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method,
    body: JSON.stringify(body),
  });
}

export function apiUpload<T>(
  path: string,
  file: File,
  fields: Record<string, string> = {}
): Promise<T> {
  const body = new FormData();
  body.append("file", file);
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  return apiRequest<T>(path, { method: "POST", body });
}
