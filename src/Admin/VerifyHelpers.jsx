import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";

const VerifyHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // 🔥 Fetch Helpers
  const fetchHelpers = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "helperRequests"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      let list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Category filter
      list = list.filter((helper) => {
        if (category === "all") return true;
        return (
          helper.service?.toLowerCase().trim() ===
          category.toLowerCase().trim()
        );
      });

      // ✅ Sorting (Frontend FIX)
      list.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });

      setHelpers(list);
    } catch (error) {
      console.error("Error fetching helpers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpers();
  }, [category, sortOrder]);

  // ✅ APPROVE
  const approveHelper = async (helper) => {
    try {
      setProcessingId(helper.id);

      await setDoc(doc(db, "helpers", helper.email), {
        ...helper,
        verified: true,
        status: "approved",
      });

      await deleteDoc(doc(db, "helperRequests", helper.id));

      fetchHelpers();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to approve helper");
    } finally {
      setProcessingId(null);
    }
  };

  // ❌ REJECT
  const rejectHelper = async (id) => {
    try {
      setProcessingId(id);

      await deleteDoc(doc(db, "helperRequests", id));

      fetchHelpers();
    } catch (error) {
      console.error(error);
      alert("Failed to reject helper");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">


        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-xs px-4 py-1 rounded-full shadow font-semibold tracking-wider uppercase">
          New Request
        </span>


        <div className="flex gap-3 text-blue-500">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/5 backdrop-blur border border-white/10 px-4 py-2 rounded-xl text-sm focus:outline-none"
          >
            <option value="all">All Services</option>
            <option value="cleaning">Cleaning</option>
            <option value="electrician">Electrician</option>
            <option value="plumbing">Plumbing</option>
            <option value="tutoring">Tutoring</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white/5 backdrop-blur border border-white/10 px-4 py-2 rounded-xl text-sm focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400 mb-4">Loading requests...</p>
      )}

      {/* Empty */}
      {!loading && helpers.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          🚫 No helper requests found
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition duration-300"
          >

            {/* AVATAR */}
            <div className="flex justify-center mb-4">
              <div className="p-[2px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <img
                  src={helper.image || "/default-user.png"}
                  alt="helper"
                  className="w-24 h-24 rounded-full object-cover bg-gray-800"
                />
              </div>
            </div>

            {/* NAME */}
            <h3 className="text-lg font-semibold tracking-wide">
              {helper.name}
            </h3>

            {/* SERVICE */}
            <p className="text-xs text-blue-400 mt-1 mb-3 uppercase tracking-wider">
              {helper.service}
            </p>

            {/* INFO */}
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              <p>{helper.email}</p>
              <p>{helper.phone}</p>
              <p className="text-gray-500 text-xs">{helper.address}</p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => approveHelper(helper)}
                disabled={processingId === helper.id}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 font-medium transition disabled:opacity-50"
              >
                {processingId === helper.id ? "Processing..." : "Approve"}
              </button>

              <button
                onClick={() => rejectHelper(helper.id)}
                disabled={processingId === helper.id}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 font-medium transition disabled:opacity-50"
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