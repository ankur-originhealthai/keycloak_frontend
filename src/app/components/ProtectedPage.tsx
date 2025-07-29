"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
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
      const response = await axios.get("http://localhost:3004/hello/", config);
      setEmail(response.data.user.email);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };
   const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:3004/hello/adminData", config);
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
    <div className="min-h-screen bg-neutral-600 py-10 px-6 ">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-600">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Protected Page</h1>
          <Logout />
        </div>
        <div className="space-y-4 ">
          <p className="text-gray-600">
            You are authenticated with <span className="font-semibold">KeyCloak Authentication</span>
          </p>
           <span>Welcome, <strong>{username}</strong></span>
          <p className="text-blue-600 font-medium">
            Your Email: {email ? email : "Loading..."}
          </p>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">Roles</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {roles.includes("admin") && <li>Admin Access</li>}
              {roles.includes("user") && <li>User Access </li>}
              {!roles.length && <li>No roles found.</li>}
            </ul>
          </div>
          <div className="mt-6">
      
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {roles.includes("admin") && <li>{adminData}</li>}
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProtectedPage;