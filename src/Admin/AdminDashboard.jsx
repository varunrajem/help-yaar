import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaUsers, FaUserCheck, FaClock } from "react-icons/fa";

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
      const helperSnapshot = await getDocs(collection(db, "helpers"));
      setTotalHelpers(helperSnapshot.size);

      const pendingQuery = query(
        collection(db, "helperRequests"),
        where("status", "==", "pending")
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      setPendingHelpers(pendingSnapshot.size);

      const userSnapshot = await getDocs(collection(db, "users"));
      setTotalUsers(userSnapshot.size);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Helpers */}
        <div
          onClick={() => navigate("/admin/helpers")}
          className="bg-blue-500 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition shadow-lg"
        >
          <h3 className="flex items-center gap-2 text-lg">
            <FaUserCheck /> Total Helpers
          </h3>
          <p className="text-3xl font-bold mt-2">{totalHelpers}</p>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => navigate("/admin/verify-helpers")}
          className="bg-yellow-500 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition shadow-lg"
        >
          <h3 className="flex items-center gap-2 text-lg">
            <FaClock /> Pending Requests
          </h3>
          <p className="text-3xl font-bold mt-2">{pendingHelpers}</p>
        </div>

        {/* Users */}
        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
          <h3 className="flex items-center gap-2 text-lg">
            <FaUsers /> Users
          </h3>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;