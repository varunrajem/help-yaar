import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const VerifyHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch Helpers
  const fetchHelpers = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "helperRequests"),
        where("status", "==", "pending"),
        orderBy("createdAt", sortOrder === "newest" ? "desc" : "asc")
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ FRONTEND FILTER (FIXED ISSUE)
      const filtered = list.filter((helper) => {
        if (category === "all") return true;
        return (
          helper.service?.toLowerCase() === category.toLowerCase()
        );
      });

      setHelpers(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto update
  useEffect(() => {
    fetchHelpers();
  }, [category, sortOrder]);

  // ✅ Approve
  const approveHelper = async (helper) => {
    await updateDoc(doc(db, "helperRequests", helper.id), {
      status: "approved",
    });

    const helperRef = doc(db, "helpers", helper.id);
    const existing = await getDoc(helperRef);

    if (!existing.exists()) {
      await setDoc(helperRef, {
        ...helper,
        verified: true,
      });
    }

    fetchHelpers();
  };

  // ❌ Reject
  const rejectHelper = async (id) => {
    await updateDoc(doc(db, "helperRequests", id), {
      status: "rejected",
    });

    fetchHelpers();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6">New Helper Requests</h2>

      {/* 🔥 Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-2 rounded"
        >
          <option value="all">All Services</option>
          <option value="cleaning">Cleaning</option>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-2 rounded"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <p className="text-gray-400 mb-4">Loading requests...</p>
      )}

      {/* ❌ Empty */}
      {!loading && helpers.length === 0 && (
        <div className="text-gray-400 text-center mt-20">
          No matching requests
        </div>
      )}

      {/* ✅ Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              {helper.name}
            </h3>

            <p className="text-gray-400 text-sm">📞 {helper.phone}</p>
            <p className="text-gray-400 text-sm">🛠 {helper.service}</p>
            <p className="text-gray-400 text-sm">📍 {helper.address}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approveHelper(helper)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-1.5 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectHelper(helper.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 py-1.5 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifyHelpers;