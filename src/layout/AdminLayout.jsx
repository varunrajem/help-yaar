import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FaUsers, FaUserCheck, FaHome } from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">

      {/* 🔥 Sidebar */}
      <div className="w-64 bg-[#0f172a] text-gray-300 p-6 flex flex-col justify-between shadow-xl">

        {/* Top */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-10 tracking-wide">
            Admin Panel
          </h2>

          <ul className="space-y-3">

            {/* Dashboard */}
            <li
              onClick={() => navigate("/admin/dashboard")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
              ${location.pathname === "/admin/dashboard"
                  ? "bg-[#1e293b] text-white"
                  : "hover:bg-[#1e293b] hover:text-white"
                }`}
            >
              <FaHome className="text-lg" />
              <span>Dashboard</span>
            </li>

            {/* Verify Helpers */}
            <li
              onClick={() => navigate("/admin/verify-helpers")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
              ${location.pathname === "/admin/verify-helpers"
                  ? "bg-[#1e293b] text-white"
                  : "hover:bg-[#1e293b] hover:text-white"
                }`}
            >
              <FaUserCheck className="text-lg" />
              <span>Verify Helpers</span>
            </li>

            {/* Website */}
            <li
              onClick={() => navigate("/")}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#1e293b] hover:text-white transition-all duration-200"
            >
              <FaUsers className="text-lg" />
              <span>Website</span>
            </li>

          </ul>
        </div>

        {/* Bottom */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-200 shadow-md"
        >
          Logout
        </button>
      </div>

      {/* 📄 Page Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;