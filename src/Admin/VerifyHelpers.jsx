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
  orderBy,
} from "firebase/firestore";

const VerifyHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // 🔥 Fetch Pending Requests
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

      // ✅ Filter by category
      const filtered = list.filter((helper) => {
        if (category === "all") return true;

        return (
          helper.service &&
          helper.service.toLowerCase().trim() ===
          category.toLowerCase().trim()
        );
      });

      setHelpers(filtered);
    } catch (error) {
      console.error("Error fetching helpers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpers();
  }, [category, sortOrder]);

  // ✅ APPROVE HELPER
  const approveHelper = async (helper) => {
    try {
      setProcessingId(helper.id);

      // 🔥 Move to helpers collection using EMAIL as ID
      await setDoc(doc(db, "helpers", helper.email), {
        name: helper.name || "",
        email: helper.email || "",
        phone: helper.phone || "",
        service: helper.service || "",
        address: helper.address || "",
        image: helper.image || "",
        verified: true,
        status: "approved", // ✅ added
        createdAt: helper.createdAt || new Date(),
      });

      // ❌ Remove from requests
      await deleteDoc(doc(db, "helperRequests", helper.id));

      alert("✅ Helper approved successfully!");

      fetchHelpers();
    } catch (error) {
      console.error("Error approving helper:", error);
      alert("❌ Failed to approve helper");
    } finally {
      setProcessingId(null);
    }
  };

  // ❌ REJECT HELPER
  const rejectHelper = async (id) => {
    try {
      setProcessingId(id);

      await deleteDoc(doc(db, "helperRequests", id));

      alert("❌ Helper request rejected");

      fetchHelpers();
    } catch (error) {
      console.error("Error rejecting helper:", error);
      alert("Failed to reject helper");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">

      {/* Header */}
      <h2 className="text-3xl font-bold mb-6">
        New Helper Requests
      </h2>

      {/* Filters */}
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

      {/* Loading */}
      {loading && (
        <p className="text-gray-400 mb-4">
          Loading requests...
        </p>
      )}

      {/* Empty */}
      {!loading && helpers.length === 0 && (
        <div className="text-gray-400 text-center mt-20">
          No matching requests
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow"
          >

            <h3 className="text-xl font-semibold mb-2">
              {helper.name}
            </h3>

            <p className="text-gray-400 text-sm">
              📧 {helper.email}
            </p>

            <p className="text-gray-400 text-sm">
              📞 {helper.phone}
            </p>

            <p className="text-gray-400 text-sm">
              🛠 {helper.service}
            </p>

            <p className="text-gray-400 text-sm">
              📍 {helper.address}
            </p>

            {/* ✅ Image */}
            {helper.image && (
              <img
                src={helper.image}
                alt="helper"
                className="w-full h-40 object-cover rounded-lg mt-3"
              />
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approveHelper(helper)}
                disabled={processingId === helper.id}
                className="flex-1 bg-green-600 hover:bg-green-700 py-1.5 rounded disabled:opacity-50"
              >
                {processingId === helper.id
                  ? "Processing..."
                  : "Approve"}
              </button>

              <button
                onClick={() => rejectHelper(helper.id)}
                disabled={processingId === helper.id}
                className="flex-1 bg-red-600 hover:bg-red-700 py-1.5 rounded disabled:opacity-50"
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