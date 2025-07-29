"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contextProvider/auth-context";
import Logout from "./Logout";
const ProtectedPage = ({ token }: { token: string }) => {
  const isRun = useRef(false);
  const [email, setEmail] = useState("");
  const [adminData, setAdminData] = useState("");
  const { isLogin, roles, username } = useAuth();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3004/user/", config);
      setEmail(response.data.user.email);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };
   const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:3004/user/adminData", config);
      setAdminData(response.data.message);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;
    fetchUserData();
    if(roles.includes("admin")){
        fetchAdminData();
    }
    
  }, []);
  return (
  <div className="min-h-screen bg-neutral-900 py-10 px-6">
    <div className="max-w-2xl mx-auto mt-35 bg-neutral-800 rounded-2xl shadow-xl border border-blue-600 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Protected Page</h1>
        <Logout />
      </div>
      <div className="space-y-4">
        <p className="text-neutral-300">
          You are authenticated with{" "}
          <span className="font-semibold text-blue-400">Keycloak Authentication</span>
        </p>
        <p className="text-neutral-300">All api routes are secured using JWT Token</p>
        <p className="text-neutral-200">
          Welcome, <span className="font-bold text-white">{username}</span>
        </p>
        <p className="text-blue-400 font-medium">
          Your Email: <span className="text-white">{email ? email : "Loading..."}</span>
        </p>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-blue-300">Roles</h2>
          <ul className="list-disc list-inside text-neutral-300 mt-2">
            {roles.includes("admin") && <li>Admin Access</li>}
            {roles.includes("user") && <li>User Access</li>}
            {!roles.length && <li>No roles found.</li>}
          </ul>
        </div>
        <div className="mt-6">
          {roles.includes("user") && (
            <ul className="list-disc list-inside text-blue-400">
              <li>This page can be accessed by normal user only</li>
            </ul>
          )}
          {roles.includes("admin") && (
            <ul className="list-disc list-inside text-blue-500 mt-4">
              <li>{adminData}</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
export default ProtectedPage;