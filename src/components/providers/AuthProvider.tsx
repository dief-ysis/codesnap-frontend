"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getToken, setToken, removeToken } from "@/lib/auth";
import { api } from "@/lib/api";

/** Authenticated user profile returned by the `/auth/me` endpoint. */
interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

/** Shape of the authentication context exposed to consumers via {@link useAuth}. */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provides authentication state and actions (login, register, logout) to the
 * component tree. On mount it attempts to hydrate the user from a stored JWT.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // Skip the API call entirely if there's no stored token — avoids an
    // unnecessary 401 request and immediately marks auth hydration as done.
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      // Token is expired or invalid — clean it up so future page loads
      // don't attempt the same failed request
      removeToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    // Store the token first so that any subsequent API calls (e.g. from
    // components that re-render after setUser) already have it available.
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => {
    const res = await api.post("/auth/register", data);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the current authentication state and actions.
 *
 * @throws {Error} If used outside of an {@link AuthProvider}
 * @returns The {@link AuthContextType} with user data and auth methods
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
