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

  const fetchHelpers = async () => {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Verify Helpers
      </h1>

      {helpers.length === 0 ? (
        <p className="text-gray-500">No pending helper requests</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {helpers.map((h) => (
            <div key={h.id} className="bg-white p-5 rounded-xl shadow">

              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={h.image || "/default.png"}
                  alt="helper"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>

              {/* Info */}
              <h2 className="text-center font-bold mt-3 text-lg">
                {h.name}
              </h2>

              <p className="text-center text-sm text-gray-600">
                {h.service}
              </p>

              <div className="mt-3 text-sm space-y-1">
                <p><strong>📞 Phone:</strong> {h.phone}</p>
                <p><strong>📍 Address:</strong> {h.address}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => approveHelper(h.id)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg w-full"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectHelper(h.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg w-full"
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