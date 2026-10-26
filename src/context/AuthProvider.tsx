import { useState, type ReactNode } from "react";
import { changePassword as changePasswordRequest, signIn as signInRequest, signUp as signUpRequest, type AuthUser, type SignupPayload } from "../services/authApi";
import { AuthContext } from "./useAuth";

const TOKEN_KEY = "route-posts-token";
const USER_KEY = "route-posts-user";

function readStoredUser(): AuthUser | null {
  try {
    const value = sessionStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) as AuthUser : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  async function acceptAuthResult(request: Promise<{ token: string; user: AuthUser | null }>) {
    const result = await request;
    sessionStorage.setItem(TOKEN_KEY, result.token);
    if (result.user) sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
    else sessionStorage.removeItem(USER_KEY);
    setToken(result.token);
    setUser(result.user);
  }

  async function signIn(login: string, password: string) {
    await acceptAuthResult(signInRequest(login, password));
  }

  async function signUp(values: SignupPayload) {
    await acceptAuthResult(signUpRequest(values));
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!token) throw new Error("Please log in again before changing your password.");
    const refreshedToken = await changePasswordRequest(token, currentPassword, newPassword);
    if (refreshedToken) {
      sessionStorage.setItem(TOKEN_KEY, refreshedToken);
      setToken(refreshedToken);
    }
  }

  function signOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ token, user, signIn, signUp, changePassword, signOut }}>{children}</AuthContext.Provider>;
}
