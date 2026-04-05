import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const VerifyHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "helperRequests"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHelpers(data);

    } catch (error) {
      console.error("Error fetching helpers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpers();
  }, []);

  const approveHelper = async (id) => {
    await updateDoc(doc(db, "helperRequests", id), {
      status: "approved",
    });
    fetchHelpers();
  };

  const rejectHelper = async (id) => {
    await updateDoc(doc(db, "helperRequests", id), {
      status: "rejected",
    });
    fetchHelpers();
  };

  // ✅ Safe Image Handler
  const getImageSrc = (image) => {
    if (!image) return "/default.png";
    if (image.startsWith("http")) return image;
    return "/default.png";
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Verify Helpers
        </h1>

        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">
          {helpers.length} Pending
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center mt-20 text-gray-500 text-lg">
          Loading helpers...
        </div>
      ) : helpers.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-lg">No pending helper requests 🚀</p>
        </div>
      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {helpers.map((h) => (
            <div
              key={h.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >

              {/* Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={getImageSrc(h.image)}
                  alt="helper"
                  onError={(e) => (e.target.src = "/default.png")}
                  className="w-16 h-16 rounded-full object-cover border"
                />

                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {h.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {h.service}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>📞 {h.phone}</p>
                <p>📍 {h.address}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => approveHelper(h.id)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg w-full font-medium transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectHelper(h.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg w-full font-medium transition"
                >
                  Reject
                </button>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default VerifyHelpers;