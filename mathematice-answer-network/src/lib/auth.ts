import { cookies } from "next/headers";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const SESSION_COOKIE = "login_data";

export type SessionUser = {
  uid: number;
  method: "local" | "google";
};

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  return secret;
}

function parsePayload(payload: string | JwtPayload): SessionUser | null {
  if (
    typeof payload === "string" ||
    !Number.isInteger(payload.uid) ||
    Number(payload.uid) <= 0 ||
    (payload.method !== "local" && payload.method !== "google")
  ) {
    return null;
  }

  return {
    uid: Number(payload.uid),
    method: payload.method,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, jwtSecret(), {
      algorithms: ["HS256"],
    });
    return parsePayload(payload);
  } catch {
    return null;
  }
}

export function createSessionToken(
  user: SessionUser,
  rememberMe = false,
): string {
  return jwt.sign(user, jwtSecret(), {
    algorithm: "HS256",
    expiresIn: rememberMe ? "30d" : "1h",
  });
}

export function sessionCookieOptions(rememberMe = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  };
}
