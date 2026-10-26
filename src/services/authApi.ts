const API_BASE_URL = "https://route-posts.routemisr.com";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

export type AuthUser = {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  photo?: string;
  [key: string]: unknown;
};

export type AuthResult = {
  token: string;
  user: AuthUser | null;
  message: string;
};

export type SignupPayload = {
  name: string;
  username?: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  password: string;
  rePassword: string;
};

function getErrorMessage(payload: ApiEnvelope<unknown>, status: number) {
  const errors = payload.errors;
  if (typeof errors === "string") return errors;
  if (errors && typeof errors === "object") {
    const first = Object.values(errors as Record<string, unknown>)[0];
    if (typeof first === "string") return first;
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  }
  return payload.message || `Request failed (${status}). Please try again.`;
}

function findAuthData(value: unknown): { token?: string; user?: AuthUser } {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  const tokenKeys = ["token", "accessToken", "access_token", "authToken"];
  let token: string | undefined;
  for (const key of tokenKeys) {
    if (typeof record[key] === "string") {
      token = record[key] as string;
      break;
    }
  }
  const candidate = record.user ?? record.profile ?? record.account;
  const user = candidate && typeof candidate === "object" ? candidate as AuthUser : undefined;
  if (token || user) return { token, user };
  for (const child of Object.values(record)) {
    const nested = findAuthData(child);
    if (nested.token || nested.user) return nested;
  }
  return {};
}

async function postAuth<T>(path: string, body: T): Promise<AuthResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not connect to Route Posts. Check your internet connection and try again.");
  }

  const payload = await response.json().catch(() => ({})) as ApiEnvelope<unknown>;
  if (!response.ok || payload.success === false) {
    throw new Error(getErrorMessage(payload, response.status));
  }

  const auth = findAuthData(payload.data ?? payload);
  if (!auth.token) {
    throw new Error(payload.message || "The server responded, but did not return an authentication token.");
  }

  return { token: auth.token, user: auth.user ?? null, message: payload.message ?? "Welcome to Route Posts!" };
}

export function signIn(login: string, password: string) {
  return postAuth("/users/signin", { login, password });
}

export function signUp(values: SignupPayload) {
  const payload = { ...values };
  if (!payload.username?.trim()) delete payload.username;
  return postAuth("/users/signup", payload);
}

export async function changePassword(token: string, password: string, newPassword: string) {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password, newPassword }),
    });
  } catch {
    throw new Error("Could not connect to Route Posts. Check your internet connection and try again.");
  }

  const payload = await response.json().catch(() => ({})) as ApiEnvelope<unknown>;
  if (!response.ok || payload.success === false) {
    throw new Error(getErrorMessage(payload, response.status));
  }
  return findAuthData(payload.data ?? payload).token;
}
