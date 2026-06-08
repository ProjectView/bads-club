/**
 * Couche d'authentification — shape compatible Firebase Auth.
 *
 * Implémentation actuelle : mock localStorage + cookie de session (pour le middleware).
 * À remplacer par `firebase/auth` quand le projet Firebase sera créé :
 *
 *   import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
 *
 * Les signatures publiques (signIn, signUp, signOut, onAuthStateChanged, currentUser) restent identiques.
 */

export type Role = "member" | "admin";

export type User = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: Role;
  favoriteSport?: "badminton" | "squash" | "petanque";
  newsletter?: boolean;
  createdAt: number;
};

const STORAGE_KEY = "bads.auth.user";
const SESSION_COOKIE = "bads_session";

// Comptes de démo pour le pitch — à remplacer par Firebase Auth.
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@badsclub.com": {
    password: "admin",
    user: {
      uid: "admin-001",
      email: "admin@badsclub.com",
      displayName: "Jonathan · Admin",
      role: "admin",
      createdAt: Date.now(),
    },
  },
  "lea@example.com": {
    password: "demo",
    user: {
      uid: "user-001",
      email: "lea@example.com",
      displayName: "Léa Martin",
      phone: "06 12 34 56 78",
      role: "member",
      favoriteSport: "badminton",
      newsletter: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
    },
  },
};

function setSessionCookie(user: User | null) {
  if (typeof document === "undefined") return;
  if (!user) {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  const payload = encodeURIComponent(JSON.stringify({ uid: user.uid, role: user.role, email: user.email }));
  document.cookie = `${SESSION_COOKIE}=${payload}; Path=/; Max-Age=${60 * 60 * 24 * 14}; SameSite=Lax`;
}

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  setSessionCookie(user);
  // Notify listeners
  window.dispatchEvent(new CustomEvent("bads-auth-change"));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export type AuthError = { code: string; message: string };

export async function signIn(email: string, password: string): Promise<User> {
  await delay(450);
  const record = DEMO_USERS[email.toLowerCase().trim()];
  if (!record) throw authError("auth/user-not-found", "Aucun compte n'est associé à cet email.");
  if (record.password !== password) throw authError("auth/wrong-password", "Mot de passe incorrect.");
  persistUser(record.user);
  return record.user;
}

export type SignUpInput = {
  displayName: string;
  email: string;
  password: string;
  phone?: string;
  favoriteSport?: User["favoriteSport"];
  newsletter?: boolean;
};

export async function signUp(input: SignUpInput): Promise<User> {
  await delay(700);
  const email = input.email.toLowerCase().trim();
  if (!isValidEmail(email)) throw authError("auth/invalid-email", "Email invalide.");
  if (input.password.length < 8) throw authError("auth/weak-password", "Le mot de passe doit faire au moins 8 caractères.");
  if (DEMO_USERS[email]) throw authError("auth/email-already-in-use", "Un compte existe déjà avec cet email.");

  const user: User = {
    uid: `user-${Math.random().toString(36).slice(2, 10)}`,
    email,
    displayName: input.displayName.trim(),
    phone: input.phone?.trim() || undefined,
    role: "member",
    favoriteSport: input.favoriteSport,
    newsletter: !!input.newsletter,
    createdAt: Date.now(),
  };
  DEMO_USERS[email] = { password: input.password, user };
  persistUser(user);
  return user;
}

export async function signOut(): Promise<void> {
  await delay(200);
  persistUser(null);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await delay(600);
  if (!isValidEmail(email)) throw authError("auth/invalid-email", "Email invalide.");
  // En vrai : sendPasswordResetEmail(auth, email)
}

// --- helpers ---
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function authError(code: string, message: string): AuthError { return { code, message }; }
