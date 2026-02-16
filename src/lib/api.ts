import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface ApiResponse<T = any> {
  status: string;
  data: T;
  message?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.message || `Request failed with status ${res.status}`,
      res.status,
      body
    );
  }

  if (res.status === 204) {
    return { status: "success", data: {} as T };
  }

  return res.json();
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint),
  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
