import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import type { AuthUser } from "@/lib/auth-types";

const DB_PATH = path.resolve(process.cwd(), ".auth-db.json");
const DEFAULT_ADMIN_EMAIL = "admin@alphabetpublishers.com";
const DEFAULT_ADMIN_PASSWORD = "Alphabet123!";

type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: AuthUser["role"];
  passwordHash: string;
  passwordSalt: string;
};

type AuthDatabase = {
  users: Record<string, StoredUser>;
};

async function ensureDb(): Promise<AuthDatabase> {
  try {
    const raw = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as AuthDatabase;
    if (parsed.users && typeof parsed.users === "object") {
      return parsed;
    }
  } catch {
    // fall through to initialize a fresh database
  }

  const initial: AuthDatabase = { users: {} };
  await mkdir(path.dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(initial, null, 2));
  return initial;
}

async function saveDb(db: AuthDatabase): Promise<void> {
  await mkdir(path.dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function createSalt(): string {
  return randomBytes(16).toString("hex");
}

async function seedDefaultUser(db: AuthDatabase): Promise<AuthDatabase> {
  if (!db.users[DEFAULT_ADMIN_EMAIL]) {
    const salt = createSalt();
    db.users[DEFAULT_ADMIN_EMAIL] = {
      id: "admin-1",
      email: DEFAULT_ADMIN_EMAIL,
      name: "Administrator",
      role: "admin",
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD, salt),
      passwordSalt: salt,
    };
    await saveDb(db);
  }

  return db;
}

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await seedDefaultUser(await ensureDb());
  const user = db.users[normalizedEmail];

  if (!user) {
    return { success: false, message: "Invalid email or password." };
  }

  const expectedHash = hashPassword(password, user.passwordSalt);
  if (expectedHash !== user.passwordHash) {
    return { success: false, message: "Invalid email or password." };
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

export async function createUser(input: { email: string; password: string; name: string }): Promise<{ success: boolean; user?: AuthUser; message: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (!normalizedEmail || !input.password || !input.name.trim()) {
    return { success: false, message: "Please provide a valid email, password, and name." };
  }

  const db = await ensureDb();
  if (db.users[normalizedEmail]) {
    return { success: false, message: "That email already exists." };
  }

  const salt = createSalt();
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    name: input.name.trim(),
    role: "customer",
    passwordHash: hashPassword(input.password, salt),
    passwordSalt: salt,
  };

  db.users[normalizedEmail] = newUser;
  await saveDb(db);

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
