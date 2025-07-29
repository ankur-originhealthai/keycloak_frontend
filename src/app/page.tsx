'use client';

import ProtectedPage from "./components/ProtectedPage";
import PublicPage from "./components/PublicPage";
import { useAuth } from "./components/auth-context";
export default function Home() {
  const {isLogin, token, roles, username} = useAuth();

  return  isLogin && token ? <ProtectedPage token={token} /> : <PublicPage />
  
}