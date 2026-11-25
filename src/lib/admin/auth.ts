/**
 * Simple hardcoded admin auth (replaces Supabase Auth for the admin portal).
 * Credentials are checked client-side and a session flag is stored in localStorage.
 */

const STORAGE_KEY = "portfolio_admin_session";

export const ADMIN_EMAIL = "lohitrajan@gmail.com";
export const ADMIN_PASSWORD = "Lohit@020907";

export type AdminSession = {
  email: string;
  loggedInAt: number;
};

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed?.email === ADMIN_EMAIL && typeof parsed.loggedInAt === "number") {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function loginAdmin(email: string, password: string): { ok: true } | { ok: false; message: string } {
  const trimmed = email.trim().toLowerCase();
  if (trimmed !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return { ok: false, message: "That email and password don't match." };
  }
  const session: AdminSession = { email: ADMIN_EMAIL, loggedInAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { ok: true };
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
