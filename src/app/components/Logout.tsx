"use client";

import { useAuth } from "./auth-context";

export default function Logout() {
  const { username, logout } = useAuth();
  return (
    <header className="p-2 flex justify-between">
     
      <button
        onClick={logout}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
}






