import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

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

/* ================= Firestore Helpers ================= */
const getHelpersByCategoryAndLocation = async (category, city, district) => {
  try {
    console.log("Selected category:", category);

    const q = query(
      collection(db, "helpers"),
      where("service", "==", category),
      where("available", "==", true)
    );

    const snapshot = await getDocs(q);
    console.log("Total helpers in category:", snapshot.size);

    // 👉 Prepare user words
    const userLocationText = `${city || ""} ${district || ""}`.toLowerCase();

    const userWords = userLocationText
      .replace(/,/g, "")
      .split(" ")
      .filter((w) => w.length > 3); // ignore small words

    console.log("User words:", userWords);

    const matchedHelpers = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((h) => {
        if (!h.address) return false;

        const helperWords = h.address
          .toLowerCase()
          .replace(/,/g, "")
          .split(" ")
          .filter((w) => w.length > 3);

        console.log("Helper words:", helperWords);

        // ✅ Smart matching
        return userWords.some((word) =>
          helperWords.some(
            (hWord) =>
              hWord.includes(word) || word.includes(hWord)
          )
        );
      });

    console.log("Matched helpers:", matchedHelpers);

    return matchedHelpers;
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return [];
  }
};

/* ================= Send Request ================= */
const sendRequestToHelper = async (helperId, userId, category, coords) => {
  if (!userId) {
    alert("Please login first");
    return;
  }

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

      {/* ===== Location Popup ===== */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-3">Location Access Required</h2>
            <p className="text-gray-700 mb-5">
              To find helpers for <b>{categoryName}</b>, allow location access.
            </p>
            <button
              onClick={handleAllowLocation}
              className="bg-green-500 text-white w-full py-3 rounded-xl font-semibold"
            >
              Allow Location
            </button>
          </div>
        </div>
      )}

      {/* ===== Location Badge ===== */}
      {(city || district) && !showPopup && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full 
            shadow-md text-xs sm:text-sm max-w-[90vw] truncate">
            📍 {city ? `${city}, ` : ""}{district}
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      {loading ? (
        <p className="text-center text-lg mt-20">
          📍 Detecting your location...
        </p>
      ) : (
        !showPopup && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              {categoryName} Helpers
            </h2>

            {availableHelpers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableHelpers.map((helper) => (
                  <div
                    key={helper.id}
                    className="bg-white/20 backdrop-blur-md p-5 rounded-2xl 
                    shadow-lg border border-white/20"
                  >
                    <h2 className="font-bold text-lg sm:text-xl mb-1">
                      {helper.name || "Unnamed"}
                    </h2>

                    <p className="text-sm opacity-90">
                      Service: {helper.service}
                    </p>

                    <p className="text-sm opacity-80 mt-1">
                      {helper.address}
                    </p>

                    <button
                      onClick={() =>
                        sendRequestToHelper(
                          helper.id,
                          userId,
                          categoryName,
                          coords
                        )
                      }
                      className="mt-4 w-full bg-yellow-400 text-black py-3 
                      rounded-xl font-semibold active:scale-95 transition"
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