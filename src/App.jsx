import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import VerifyHelpers from "./Admin/VerifyHelpers";


// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ServiceRequest = lazy(() => import("./pages/ServiceRequest"));
const BeHelper = lazy(() => import("./pages/BeHelper"));

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

          {/* Main Website */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/service/:categoryName" element={<ServiceRequest />} />
            <Route path="/be-helper" element={<BeHelper />} />
          </Route>

          {/* ✅ Admin Login (NO sidebar) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ✅ Admin Layout (WITH sidebar) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="verify-helpers" element={<VerifyHelpers />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;