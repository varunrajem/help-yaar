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
} from "firebase/firestore";

const VerifyHelpers = () => {
  const [helpers, setHelpers] = useState([]);

  const fetchHelpers = async () => {
    const q = query(
      collection(db, "helperRequests"),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setHelpers(list);
  };

  useEffect(() => {
    fetchHelpers();
  }, []);

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

  const rejectHelper = async (id) => {
    await updateDoc(doc(db, "helperRequests", id), {
      status: "rejected",
    });

    fetchHelpers();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">New Helper Requests</h2>

      {helpers.length === 0 && <p>No new requests</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-xl"
          >
            <h3 className="text-xl">{helper.name}</h3>
            <p>{helper.phone}</p>
            <p>{helper.service}</p>
            <p>{helper.address}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approveHelper(helper)}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectHelper(helper.id)}
                className="bg-red-600 px-3 py-1 rounded"
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