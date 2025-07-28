"use client";
import Keycloak from "keycloak-js";
import { useEffect, useRef, useState } from "react";
const useAuth = () => {
  const [isLogin, setLogin] = useState(false);
  const [token, setToken] = useState("");
  const isRun = useRef(false);
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;
    const client = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT,
    });
    client
      .init({ onLoad: "login-required", pkceMethod: "S256" })
      .then(async (authenticated) => {
        if (authenticated) {
          await client.updateToken(5);
          setLogin(true);
          setToken(client.token ?? "abc");
        }
      })
      .catch((err) => {
        console.error("Keycloak init error", err);
      });
  }, []);

  return [isLogin, token];
};
export default useAuth;
