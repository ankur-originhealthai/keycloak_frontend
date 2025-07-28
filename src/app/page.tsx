'use client';
import useAuth from "./components/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectedPage from "./components/ProtectedPage";
export default function Home() {
  const router = useRouter();
  const [isLogin, token] = useAuth();
  useEffect(() => {
    if (isLogin) {
      <ProtectedPage token={token}/>
    } else {
      router.push("/signIn");
    }
  }, [isLogin, router]);
  
}