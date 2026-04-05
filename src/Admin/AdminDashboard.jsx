import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaUsers, FaUserCheck, FaClock, FaHome } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [totalHelpers, setTotalHelpers] = useState(0);
  const [pendingHelpers, setPendingHelpers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Total Helpers (optional if using helpers collection)
        const helperSnapshot = await getDocs(collection(db, "helpers"));
        setTotalHelpers(helperSnapshot.size);

        // ✅ Pending Helper Requests
        const pendingQuery = query(
          collection(db, "helperRequests"),
          where("status", "==", "pending")
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        setPendingHelpers(pendingSnapshot.size);

        // Total Users
        const userSnapshot = await getDocs(collection(db, "users"));
        setTotalUsers(userSnapshot.size);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}


      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-500 text-white p-6 rounded-xl">
            <h3>Total Helpers</h3>
            <p className="text-3xl font-bold">{totalHelpers}</p>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-xl">
            <h3>Pending Helper Requests</h3>
            <p className="text-3xl font-bold">{pendingHelpers}</p>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-xl">
            <h3>Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;