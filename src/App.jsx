import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import VerifyHelpers from "./Admin/VerifyHelpers";
import HelpersList from "./Admin/HelpersList";
import AdminRoute from "./Admin/AdminRoute";

// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ServiceRequest = lazy(() => import("./pages/ServiceRequest"));
const BeHelper = lazy(() => import("./pages/BeHelper"));
const HelperLogin = lazy(() => import("./pages/HelperLogin"));
const HelperDashboard = lazy(() => import("./pages/HelperDashboard"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>

          {/* 🌐 Main Website */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/service/:categoryName" element={<ServiceRequest />} />
            <Route path="/be-helper" element={<BeHelper />} />
            <Route path="/helper-login" element={<HelperLogin />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/chat/:requestId" element={<ChatPage />} />
          </Route>

          {/* 👨‍🔧 Helper Dashboard */}
          <Route path="/helper-dashboard" element={<HelperDashboard />} />

          {/* 🔑 Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔐 Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="verify-helpers" element={<VerifyHelpers />} />
            <Route path="helpers" element={<HelpersList />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;