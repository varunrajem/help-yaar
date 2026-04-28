import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot, // 🔥 REAL-TIME
} from "firebase/firestore";

/* ================= Reverse Geocoding ================= */
const reverseGeocodeCity = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();

    return {
      displayName: data.display_name || "Unknown location",
      district:
        data.address?.state_district ||
        data.address?.county ||
        "",
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "",
    };
  } catch (err) {
    console.error(err);
    return { displayName: "", district: "", city: "" };
  }
};

/* ================= Fetch Helpers ================= */
const getHelpersByCategoryAndLocation = async (category, city, district) => {
  const q = query(
    collection(db, "helpers"),
    where("service", "==", category)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((h) => {
      if (!h.address) return false;
      const addr = h.address.toLowerCase();
      return (
        addr.includes(city.toLowerCase()) ||
        addr.includes(district.toLowerCase())
      );
    });
};

/* ================= MAIN COMPONENT ================= */
const ServiceRequest = () => {
  const { categoryName } = useParams();
  const user = auth.currentUser;

  const [coords, setCoords] = useState(null);
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [helpers, setHelpers] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔥 Track user requests
  const [userRequests, setUserRequests] = useState({});

  /* ================= REAL-TIME USER REQUESTS ================= */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "requests"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        map[data.helperEmail] = data.status;
      });

      setUserRequests(map);
    });

    return () => unsubscribe();
  }, [user]);

  /* ================= SEND REQUEST ================= */
  const sendRequestToHelper = async (helper) => {
    if (!user) return alert("Please login first");

    if (!helper?.email) {
      alert("Helper email missing ❌");
      return;
    }

    await addDoc(collection(db, "requests"), {
      helperEmail: helper.email,
      helperName: helper.name || "Helper",

      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || "User",

      service: categoryName,
      address: helper.address || "",
      location: coords || null,

      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Request sent!");
  };

  /* ================= LOCATION ================= */
  const handleAllowLocation = () => {
    setLoading(true);
    setShowPopup(false);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const c = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setCoords(c);

      const loc = await reverseGeocodeCity(c.lat, c.lng);
      setCity(loc.city);
      setDistrict(loc.district);

      const data = await getHelpersByCategoryAndLocation(
        categoryName,
        loc.city,
        loc.district
      );

      setHelpers(data);
      setLoading(false);
    });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-tl from-green-400 via-blue-500 to-indigo-900 
      text-white px-4 sm:px-6 pt-28 pb-10 relative">

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-3">Location Access Required</h2>
            <p className="mb-5">
              Allow location to find <b>{categoryName}</b> helpers.
            </p>
            <button
              onClick={handleAllowLocation}
              className="bg-green-500 text-white w-full py-3 rounded-xl"
            >
              Allow Location
            </button>
          </div>
        </div>
      )}

      {/* Location Badge */}
      {(city || district) && !showPopup && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40">
          📍 {city} {district}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-center mt-20">📍 Detecting location...</p>
      ) : (
        !showPopup && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {categoryName} Helpers
            </h2>

            {helpers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {helpers.map((helper) => {
                  const status = userRequests[helper.email];

                  return (
                    <div
                      key={helper.id}
                      className="bg-white/20 backdrop-blur-md p-5 rounded-2xl 
                      shadow-lg border border-white/20"
                    >
                      <h2 className="font-bold text-lg mb-1">
                        {helper.name}
                      </h2>

                      <p className="text-sm opacity-90">
                        Service: {helper.service}
                      </p>

                      <p className="text-sm opacity-80 mt-1">
                        {helper.address}
                      </p>

                      <button
                        onClick={() => sendRequestToHelper(helper)}
                        disabled={status === "pending"}
                        className="mt-4 w-full bg-yellow-400 text-black py-3 
                        rounded-xl font-semibold transition disabled:opacity-60"
                      >
                        {status === "pending"
                          ? "Pending ⏳"
                          : "Send Request"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-10 text-center text-lg">
                No helpers available in your area.
              </p>
            )}
          </>
        )
      )}
    </div>
  );
};

export default ServiceRequest;