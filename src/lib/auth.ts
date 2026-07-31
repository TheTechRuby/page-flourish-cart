import type { AuthUser } from "@/lib/auth-types";

const USER_STORE_KEY = "page-flourish-auth-users";
const SESSION_STORE_KEY = "page-flourish-auth-session";
const DEFAULT_ADMIN_EMAIL = "alphabetpublishers61@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Alphabet123!";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: AuthUser["role"];
  passwordHash: string;
  passwordSalt: string;
};

type StoredSession = {
  userId: string;
  email: string;
  expiresAt: number;
};

async function readUsers(): Promise<Record<string, StoredUser>> {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const raw = storage.getItem(USER_STORE_KEY);
    if (!raw) {
      return seedDefaultUser();
    }

    const parsed = JSON.parse(raw) as Record<string, StoredUser>;
    if (!parsed[DEFAULT_ADMIN_EMAIL]) {
      return seedDefaultUser(parsed);
    }

    return parsed;
  } catch {
    return seedDefaultUser();
  }
}

async function seedDefaultUser(existingUsers?: Record<string, StoredUser>): Promise<Record<string, StoredUser>> {
  const storage = getStorage();
  const users = existingUsers ?? {};

  if (!users[DEFAULT_ADMIN_EMAIL]) {
    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD, salt);
    users[DEFAULT_ADMIN_EMAIL] = {
      id: "admin-1",
      email: DEFAULT_ADMIN_EMAIL,
      name: "Administrator",
      role: "admin",
      passwordHash,
      passwordSalt: salt,
    };
  }

  if (storage) {
    storage.setItem(USER_STORE_KEY, JSON.stringify(users));
  }

  return users;
}

function generateRandomHex(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value: string): Uint8Array {
  if (value.length % 2 !== 0) {
    return new Uint8Array(0);
  }

  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

async function verifyPassword(password: string, storedUser: StoredUser): Promise<boolean> {
  const hashed = await hashPassword(password, storedUser.passwordSalt);
  const expected = hexToBytes(storedUser.passwordHash);
  const actual = hexToBytes(hashed);

  if (expected.length !== actual.length) return false;

  let result = 0;
  for (let index = 0; index < expected.length; index += 1) {
    result |= expected[index] ^ actual[index];
  }

  return result === 0;
}

function persistUsers(users: Record<string, StoredUser>): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(USER_STORE_KEY, JSON.stringify(users));
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readUsers();
  const user = users[normalizedEmail];

  if (!user || !(await verifyPassword(password, user))) {
    return { success: false, message: "Invalid email or password." };
  }

  const session: StoredSession = {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 8,
  };

  const storage = getStorage();
  if (storage) {
    storage.setItem(SESSION_STORE_KEY, JSON.stringify(session));
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    message: "Signed in successfully.",
  };
}

export async function getCurrentSessionUser(): Promise<AuthUser | null> {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(SESSION_STORE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as StoredSession;
    if (session.expiresAt <= Date.now()) {
      storage.removeItem(SESSION_STORE_KEY);
      return null;
    }

    const users = await readUsers();
    const user = users[session.email?.toLowerCase() ?? ""];

    if (!user) {
      storage.removeItem(SESSION_STORE_KEY);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export function signOut(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(SESSION_STORE_KEY);
}

export async function getSessionStatus(): Promise<{ signedIn: boolean; user: AuthUser | null }> {
  const user = await getCurrentSessionUser();
  return { signedIn: Boolean(user), user };
}

export async function registerUser(input: { email: string; password: string; name: string }): Promise<{ success: boolean; user?: AuthUser; message: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (!normalizedEmail || !input.password || !input.name.trim()) {
    return { success: false, message: "Please provide a valid email, password, and name." };
  }

  const users = await readUsers();
  if (users[normalizedEmail]) {
    return { success: false, message: "That email already exists." };
  }

  const salt = generateRandomHex(16);
  const passwordHash = await hashPassword(input.password, salt);
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    name: input.name.trim(),
    role: "customer",
    passwordHash,
    passwordSalt: salt,
  };

  users[normalizedEmail] = newUser;
  persistUsers(users);

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
    message: "Account created successfully.",
  };
}
