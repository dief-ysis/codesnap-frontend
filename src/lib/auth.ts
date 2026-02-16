/** localStorage key used to persist the JWT authentication token. */
const TOKEN_KEY = "codesnap_token";

/**
 * Retrieves the stored JWT token from localStorage.
 *
 * Returns `null` when running on the server (SSR) or when no token is stored.
 *
 * @returns The JWT string or `null`
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Persists a JWT token to localStorage.
 *
 * @param token - The JWT string received from the API after login or registration
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the JWT token from localStorage, effectively logging the user out on the client side.
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
