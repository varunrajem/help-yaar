import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // 🔥 Handle auth properly (important)
    const unsubscribeAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "requests"),
      where("userId", "==", user.uid),
      where("status", "==", "accepted")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(list);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">

      <h1 className="text-2xl font-bold mb-6">
        📦 My Bookings
      </h1>

      {!user ? (
        <p>Please login to see your bookings</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-gray-800 p-5 rounded-xl border border-gray-700"
            >
              <h3 className="text-lg font-semibold">
                {b.service}
              </h3>

              <p className="text-sm text-gray-400">
                👨‍🔧 {b.helperName}
              </p>

              <p className="text-sm text-gray-400">
                📧 {b.helperEmail}
              </p>

              <p className="text-sm text-gray-400">
                📍 {b.address}
              </p>

              <p className="mt-2 text-green-400 font-semibold">
                ✅ Accepted
              </p>

              {/* 🔥 CHAT BUTTON */}
              <button
                onClick={() => navigate(`/chat/${b.id}`)}
                className="mt-4 w-full bg-blue-500 py-2 rounded"
              >
                Chat 💬
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;