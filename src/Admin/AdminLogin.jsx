import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // make sure db is exported
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Both email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");


      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password.trim()
      );

      const user = userCredential.user;

      // 🔥 Step 2: Check Firestore (admins collection using UID)
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        await signOut(auth);
        setError("You are not authorized as admin");
        return;
      }

      navigate("/admin/dashboard");

    } catch (err) {
      console.log(err.code);

      if (err.code === "auth/user-not-found") {
        setError("User not found");
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong password");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid credentials");
      } else {
        setError("Login failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">

      <form
        onSubmit={handleLogin}
        className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-[360px]"
      >

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Sign in to access Help-Yaar admin
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500/20 border border-red-400 px-3 py-2 rounded-lg text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Authorized access only
        </p>
      </form>

    </div>
  );
};

export default AdminLogin;