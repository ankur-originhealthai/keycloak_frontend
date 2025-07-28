'use client';
import useAuth from "./components/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  const [isLogin, token] = useAuth();
  console.log("token", token)
  useEffect(() => {
    if (isLogin) {
      router.push("/publicPage");
    } else {
      router.push("/signIn");
    }
  }, [isLogin, router]);
  return null; 
}