"use client";
import Keycloak from "keycloak-js";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
interface DecodedToken {
  realm_access?: { roles: string[] };
  email?: string;
  preferred_username?: string;
}
interface AuthContextType {
  isLogin: boolean;
  token: string | null;
  roles: string[];
  username: string | null;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setLogin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const isKeycloakInitialized = useRef(false);
  const keycloakRef = useRef<Keycloak | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isKeycloakInitialized.current) return;
    isKeycloakInitialized.current = true;
    const keycloak = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT!,
    });
    keycloakRef.current = keycloak;
    keycloak
      .init({ onLoad: "login-required" })
      .then((authenticated) => {
        if (!authenticated) {
          setLogin(false);
          return;
        }
        const kcToken = keycloak.token!;
        const decoded: DecodedToken = jwtDecode(kcToken);
        setLogin(true);
        setToken(kcToken);
        localStorage.setItem("token", kcToken);
        setRoles(decoded?.realm_access?.roles || []);
        setUsername(decoded?.preferred_username || null);
      
        intervalRef.current = setInterval(() => {
          keycloak
            .updateToken(70)
            .then((refreshed) => {
              if (refreshed) {
                const updatedToken = keycloak.token!;
                const decoded: DecodedToken = jwtDecode(updatedToken);
                setToken(updatedToken);
                setRoles(decoded?.realm_access?.roles || []);
                setUsername(decoded?.preferred_username || null);
                localStorage.setItem("token", updatedToken);
              }
            })
            .catch(() => {
              console.warn("Token refresh failed. Logging out...");
              logout();
            });
        }, 60000);

        keycloak.onTokenExpired = () => {
          console.warn("Token expired. Logging out...");
          logout();
        };
      })
      .catch((err) => {
        console.error("Keycloak init error:", err);
      });
   
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  const logout = () => {
    keycloakRef.current?.logout({
      redirectUri: window.location.origin,
    });
    localStorage.removeItem("token");
    setLogin(false);
    setToken(null);
    setRoles([]);
    setUsername(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  return (
    <AuthContext.Provider
      value={{ isLogin, token, roles, username, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};