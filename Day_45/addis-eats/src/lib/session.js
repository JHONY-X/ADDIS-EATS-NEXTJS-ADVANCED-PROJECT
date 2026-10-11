// src/lib/session.js
import crypto from "node:crypto";
import { cookies } from "next/headers";

// ─── Users (demo only — a real app uses a database) ─────
// Passwords would be hashed with bcrypt or argon2 in production.
export const users = [
  {
    id: "usr_1",
    name: "Almaz",
    email: "almaz@addis-eats.com",
    password: "kitfo123",
    role: "customer",
  },
  {
    id: "usr_2",
    name: "Dawit",
    email: "dawit@addis-eats.com",
    password: "tibs456",
    role: "customer",
  },
  {
    id: "usr_3",
    name: "Chef Hana",
    email: "staff@addis-eats.com",
    password: "kitchen789",
    role: "staff",
  },
];

const SESSION_SECRET =
  process.env.SESSION_SECRET || "addis-eats-session-secret-key-at-least-32-chars-long";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Create HMAC-SHA256 signed session token for serverless compatibility across all Vercel instances
function createSessionToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

// Verify HMAC-SHA256 signed session token
function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const data = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.expiresAt && payload.expiresAt < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// ─── Sign in ────────────────────────────────────────────
export async function signIn(email, password) {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) return null;

  const payload = {
    userId: user.id,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  const sessionId = createSessionToken(payload);

  return { sessionId, user: { id: user.id, name: user.name, role: user.role } };
}

// ─── Sign out ───────────────────────────────────────────
export async function signOut(_sessionId) {
  // Stateless signed tokens are invalidated by clearing the cookie in /api/auth/signout
}

// ─── Read the current user ─────────────────────────────
// Used by server components, server actions, and route handlers.
export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload?.userId) return null;

  const user = users.find((u) => u.id === payload.userId);
  if (!user) return null;

  // Never return the password
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

// ─── Cookie configuration ───────────────────────────────
export const SESSION_COOKIE_NAME = "session";

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
