import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

/* ================= Reverse Geocoding (OSM) ================= */
const reverseGeocodeCity = async (lat, lng) => {
  try {
    const res = await fetch(
      `/api/reverse-geocode?lat=${lat}&lon=${lng}`
    );

    const data = await res.json();
    console.log("OSM response:", data);

    return {
      displayName: data.display_name || "Unknown location",
      district:
        data.address?.state_district ||
        data.address?.county ||
        "Unknown district",
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
      district: "Unknown district",
      city: ""
    };
  }
};



/* ================= Firestore Helpers ================= */
const getHelpersByCategoryAndLocation = async (category, city) => {
  try {
    const q = query(
      collection(db, "helpers"),
      where("service", "==", category)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((h) => {
        if (!h.available) return false;
        if (!h.location || typeof h.location !== "string") return false;
        return city.toLowerCase().includes(h.location.toLowerCase());
      });
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return [];
  }
};

/* ================= Send Request ================= */
const sendRequestToHelper = async (helperId, userId, category, coords) => {
  try {
    await addDoc(collection(db, "requests"), {
      helperId,
      userId,
      category,
      location: coords,
      status: "pending",
      createdAt: new Date()
    });
    alert("Request sent successfully!");
  } catch (error) {
    console.error("Error sending request:", error);
    alert("Failed to send request.");
  }
};

/* ================= MAIN COMPONENT ================= */
const ServiceRequest = () => {
  const { categoryName } = useParams();
  const userId = auth.currentUser?.uid;

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
          lng: pos.coords.longitude
        };
        console.log("✅ Coordinates:", userCoords);
        setCoords(userCoords);

        const locationData = await reverseGeocodeCity(
          userCoords.lat,
          userCoords.lng
        );
        console.log("📍 Resolved location:", locationData);

        setDisplayName(locationData.displayName);
        setDistrict(locationData.district);
        setCity(locationData.city);

        const helpers = await getHelpersByCategoryAndLocation(
          categoryName,
          locationData.city
        );

        setAvailableHelpers(helpers);
        setLoading(false);
      },
      (err) => {
        console.error("❌ Location error:", err);
        alert("Location access denied.");
        setLoading(false);
        setShowPopup(true);
      }
    );
  };

  /* ---------- Deny Location ---------- */
  const handleDenyLocation = () => {
    setShowPopup(false);
    setLoading(false);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-tl from-green-400 via-blue-500 to-indigo-900 text-white p-6 mt-12 relative">

      {/* ================= CENTER POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-3">
              Location Access Required
            </h2>
            <p className="text-gray-700 mb-5">
              To find helpers for <b>{categoryName}</b>, please allow location access.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleAllowLocation}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Allow
              </button>

              <button
                onClick={handleDenyLocation}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOCATION BADGE ================= */}
      {district && !showPopup && (
        <div className="absolute top-4 right-4 group">
          {/* Default (district only) */}
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-sm cursor-pointer max-w-xs truncate">
            📍 {district}
          </div>

          {/* Hover (full address) */}
          <div className="hidden group-hover:block absolute right-0 mt-2 bg-black/80 text-white text-xs p-3 rounded-lg w-80 shadow-lg">
            {displayName}
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      {loading ? (
        <p className="text-center text-lg mt-20">
          Detecting your location...
        </p>
      ) : (
        !showPopup && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center">
              {categoryName} Helpers
            </h2>

            {availableHelpers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableHelpers.map((helper) => (
                  <div
                    key={helper.id}
                    className="bg-white/20 p-4 rounded border border-white/30 shadow-md"
                  >
                    <h2 className="font-bold text-lg">
                      {helper.name || "Unnamed"}
                    </h2>
                    <p>Service: {helper.service}</p>
                    <p>Area: {helper.location}</p>

                    <button
                      onClick={() =>
                        sendRequestToHelper(
                          helper.id,
                          userId,
                          categoryName,
                          coords
                        )
                      }
                      className="mt-3 bg-yellow-300 text-black px-3 py-2 rounded hover:bg-yellow-400"
                    >
                      Send Request
                    </button>
                  </div>
                ))}
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
