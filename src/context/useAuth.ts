import { createContext, useContext } from "react";
import type { AuthUser, SignupPayload } from "../services/authApi";

export type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  signIn: (login: string, password: string) => Promise<void>;
  signUp: (values: SignupPayload) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
