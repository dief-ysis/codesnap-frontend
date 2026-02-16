import { getToken } from "./auth";

/** Base URL for all API requests, sourced from the environment or falling back to localhost. */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

/**
 * Standard envelope returned by the CodeSnap API.
 *
 * @template T - The shape of the `data` payload
 */
interface ApiResponse<T = any> {
  status: string;
  data: T;
  message?: string;
}

/**
 * Custom error thrown when an API request returns a non-OK HTTP status.
 * Carries the HTTP status code and optional response body for downstream handling.
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
  }
}

/**
 * Performs an authenticated fetch request against the CodeSnap API.
 *
 * Automatically injects the JWT Bearer token when available, parses JSON
 * responses, and synthesises a success envelope for 204 No Content responses.
 *
 * @template T - Expected shape of the response data payload
 * @param endpoint - API path relative to the base URL (e.g. `/snippets`)
 * @param options - Standard `RequestInit` overrides (method, body, headers, etc.)
 * @returns The parsed API response envelope
 * @throws {ApiError} When the server responds with a non-OK status
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    // Conditionally inject the Bearer token using spread — avoids sending
    // an empty Authorization header when the user is not authenticated.
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // Attempt to parse the error body as JSON; fall back to an empty object
    // for non-JSON error responses (e.g. plain-text 502 from a reverse proxy).
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.message || `Request failed with status ${res.status}`,
      res.status,
      body
    );
  }

  // 204 No Content has no body to parse — synthesise a success envelope
  // so callers can handle all responses uniformly without special-casing.
  if (res.status === 204) {
    return { status: "success", data: {} as T };
  }

  return res.json();
}

/**
 * Convenience object exposing HTTP methods (GET, POST, PATCH, DELETE) as
 * thin wrappers around {@link request}. Each method auto-serialises the
 * request body as JSON.
 */
export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint),
  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
