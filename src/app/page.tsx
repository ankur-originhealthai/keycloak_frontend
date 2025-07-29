'use client';
import useAuth from "./components/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectedPage from "./components/ProtectedPage";
import PublicPage from "./components/PublicPage";
export default function Home() {
  const router = useRouter();
  const [isLogin, token] = useAuth();

  return  isLogin ? <ProtectedPage token={token} /> : <PublicPage />
  
}