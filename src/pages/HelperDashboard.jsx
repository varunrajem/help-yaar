import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  getDocs, // 🔥 IMPORTANT
} from "firebase/firestore";

const HelperDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get("email");

  const [requests, setRequests] = useState([]);
  const [helper, setHelper] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch helper profile
  const fetchHelper = async () => {
    try {
      const ref = doc(db, "helpers", email);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setHelper(snap.data());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 REAL-TIME REQUEST LISTENER
  useEffect(() => {
    if (!email) return;

    fetchHelper();

    const q = query(
      collection(db, "requests"),
      where("helperEmail", "==", email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [email]);

  // ✅ ACCEPT + SAFE CHAT CREATION
  const acceptRequest = async (req) => {
    try {
      // ✅ Update request status
      await updateDoc(doc(db, "requests", req.id), {
        status: "accepted",
      });

      // 🔥 Check if chat already exists
      const q = query(
        collection(db, "chats"),
        where("requestId", "==", req.id)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        console.log("Creating chat...");

        await addDoc(collection(db, "chats"), {
          requestId: req.id,
          userId: req.userId,
          helperEmail: req.helperEmail,
          createdAt: serverTimestamp(),
        });

        console.log("Chat created ✅");
      } else {
        console.log("Chat already exists ⚠️");
      }

    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  // ❌ REJECT
  const rejectRequest = async (id) => {
    try {
      await updateDoc(doc(db, "requests", id), {
        status: "rejected",
      });
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">

      {/* 🔥 LEFT SIDEBAR */}
      <div className="w-1/4 bg-gray-800 p-6 border-r border-gray-700">

        <h2 className="text-xl font-bold mb-6">
          👋 Hi, {helper?.name || "Helper"}
        </h2>

        {helper?.image && (
          <img
            src={helper.image}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}

        <p className="text-sm text-gray-400">
          📧 {helper?.email}
        </p>

        <p className="text-sm text-gray-400">
          📞 {helper?.phone}
        </p>

        <p className="text-sm text-gray-400">
          🛠 {helper?.service}
        </p>

      </div>

      {/* 🔥 RIGHT CONTENT */}
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          📦 Service Requests
        </h1>

        {loading && <p>Loading requests...</p>}

        {!loading && requests.length === 0 && (
          <p>No service requests yet</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-gray-800 p-5 rounded-xl border border-gray-700"
            >
              <h3 className="text-lg font-semibold">
                {req.service}
              </h3>

              <p className="text-sm text-gray-400">
                👤 {req.userName}
              </p>

              <p className="text-sm text-gray-400">
                📞 {req.userPhone || "N/A"}
              </p>

              <p className="text-sm text-gray-400">
                📍 {req.address}
              </p>

              <p className="mt-2 text-sm">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {req.status}
                </span>
              </p>

              {/* 🔥 ACTION BUTTONS */}
              {req.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => acceptRequest(req)}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectRequest(req.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* 🔥 CHAT BUTTON AFTER ACCEPT */}
              {req.status === "accepted" && (
                <button
                  onClick={() => navigate(`/chat/${req.id}`)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
                >
                  Chat 💬
                </button>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HelperDashboard;