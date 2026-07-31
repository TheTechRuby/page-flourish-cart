import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/auth-types";
import { getSessionStatus, signOut as clearSession, signIn as authenticate } from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const session = await getSessionStatus();
      if (!cancelled) {
        setUser(session.user);
        setSignedIn(session.signedIn);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    signedIn,
    signIn: async (email, password) => {
      const result = await authenticate(email, password);
      if (result.success) {
        setUser(result.user ?? null);
        setSignedIn(true);
      }
      return result;
    },
    signOut: () => {
      clearSession();
      setUser(null);
      setSignedIn(false);
    },
  }), [user, signedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
