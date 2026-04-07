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
    <div className="bg-[#f1f5f9] min-h-screen">

      {/* 🔥 Sidebar (FIXED) */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-[#0f172a] text-gray-300 p-6 flex flex-col justify-between shadow-xl">

        {/* Top */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-10 tracking-wide">
            Admin Panel
          </h2>

          <ul className="space-y-3">

            <li
              onClick={() => navigate("/admin/dashboard")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
              ${location.pathname === "/admin/dashboard"
                  ? "bg-[#1e293b] text-white"
                  : "hover:bg-[#1e293b] hover:text-white"
                }`}
            >
              <FaHome />
              Dashboard
            </li>

            <li
              onClick={() => navigate("/admin/verify-helpers")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
              ${location.pathname === "/admin/verify-helpers"
                  ? "bg-[#1e293b] text-white"
                  : "hover:bg-[#1e293b] hover:text-white"
                }`}
            >
              <FaUserCheck />
              Verify Helpers
            </li>

            <li
              onClick={() => navigate("/")}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#1e293b] hover:text-white transition"
            >
              <FaUsers />
              Website
            </li>

          </ul>
        </div>

        {/* Bottom */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* 📄 Content (SCROLLABLE) */}
      <div className="ml-64 p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;