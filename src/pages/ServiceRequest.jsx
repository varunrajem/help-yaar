import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
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
        ""
    };
  } catch (err) {
    console.error("OSM error:", err);
    return {
      displayName: "Unknown location",
      district: "",
      city: ""
    };
  }
};

/* ================= Fetch Helpers ================= */
const getHelpersByCategoryAndLocation = async (category, city, district) => {
  try {
    const q = query(
      collection(db, "helpers"),
      where("service", "==", category)
    );

    const snapshot = await getDocs(q);

    const matchedHelpers = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((h) => {
        if (!h.address) return false;

        const address = h.address.toLowerCase();

        return (
          address.includes(city.toLowerCase()) ||
          address.includes(district.toLowerCase())
        );
      });

    return matchedHelpers;

  } catch (error) {
    console.error("Error fetching helpers:", error);
    return [];
  }
};

/* ================= Send Request ================= */
const sendRequestToHelper = async (helper, user, category, coords) => {
  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    await addDoc(collection(db, "requests"), {
      helperEmail: helper.email, // 🔥 IMPORTANT
      helperId: helper.id,
      helperName: helper.name,

      userId: user.uid,
      userName: user.displayName || "User",
      userPhone: user.phoneNumber || "",

      service: category,
      address: helper.address,
      location: coords,

      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("✅ Request sent successfully!");
  } catch (error) {
    console.error("Error sending request:", error);
    alert("Failed to send request.");
  }
};

/* ================= MAIN COMPONENT ================= */
const ServiceRequest = () => {
  const { categoryName } = useParams();
  const user = auth.currentUser;

  const [coords, setCoords] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [availableHelpers, setAvailableHelpers] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ---------- Allow Location ---------- */
  const handleAllowLocation = () => {
    setLoading(true);
    setShowPopup(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCoords(userCoords);

        const locationData = await reverseGeocodeCity(
          userCoords.lat,
          userCoords.lng
        );

        setDisplayName(locationData.displayName);
        setDistrict(locationData.district);
        setCity(locationData.city);

        const helpers = await getHelpersByCategoryAndLocation(
          categoryName,
          locationData.city,
          locationData.district
        );

        setAvailableHelpers(helpers);
        setLoading(false);
      },
      () => {
        alert("Location access denied.");
        setLoading(false);
        setShowPopup(true);
      }
    );
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

            {availableHelpers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableHelpers.map((helper) => (
                  <div
                    key={helper.id}
                    className="bg-white/20 p-5 rounded-xl"
                  >
                    <h3 className="font-bold">{helper.name}</h3>
                    <p>{helper.address}</p>

                    <button
                      onClick={() =>
                        sendRequestToHelper(
                          helper,
                          user,
                          categoryName,
                          coords
                        )
                      }
                      className="mt-3 w-full bg-yellow-400 text-black py-2 rounded"
                    >
                      Send Request
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-10">
                No helpers available nearby
              </p>
            )}
          </>
        )
      )}
    </div>
  );
};

export default ServiceRequest;