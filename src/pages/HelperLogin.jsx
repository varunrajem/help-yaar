import React, { useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const HelperLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) {
      setMessage("❌ Please enter email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // ✅ Check approved helpers
      const helperRef = doc(db, "helpers", email);
      const helperSnap = await getDoc(helperRef);

      if (helperSnap.exists()) {
        // 🔥 Redirect if approved
        navigate(`/helper-dashboard?email=${email}`);
        return;
      }

      // ⏳ Check pending
      const q = query(
        collection(db, "helperRequests"),
        where("email", "==", email)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setMessage("⏳ Your request is still pending approval");
      } else {
        setMessage("❌ No helper account found. Please register first.");
        setTimeout(() => navigate("/be-helper"), 2000);
      }

    } catch (error) {
      console.error(error);
      setMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          🧑‍🔧 Helper Login
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 mb-4 outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          {loading ? "Checking..." : "Login"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-yellow-300 text-sm">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default HelperLogin;