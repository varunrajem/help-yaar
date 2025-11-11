import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const API_KEY = "AIzaSyBfUxvHP50YgPKunL8F2oAs9_fOJkJK6Vc"; // Replace with your key

// Convert lat/lng to city name
const reverseGeocodeCity = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const data = await res.json();
    console.log("Geocoding API response:", data);

    if (data.results && data.results[0] && data.results[0].address_components) {
      // Find the city/locality component
      const cityComponent = data.results[0].address_components.find((comp) =>
        comp.types.includes("locality")
      );
      console.log(cityComponent)
      if (cityComponent) return cityComponent.long_name;

      // If no city, return formatted address
      return data.results[0].formatted_address || "Unknown location";
    }
    return "Unknown location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown location";
  }
};

// Get helpers that match category + area name safely
const getHelpersByCategoryAndLocation = async (category, address) => {
  try {
    const q = query(collection(db, "helpers"), where("service", "==", category));
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((h) => {
        if (!h.available) return false;
        if (!h.location || typeof h.location !== "string") return false;
        return address.toLowerCase().includes(h.location.toLowerCase());
      });
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return [];
  }
};

// Send user request to helper
const sendRequestToHelper = async (helperId, userId, category, coords) => {
  try {
    await addDoc(collection(db, "requests"), {
      helperId,
      userId,
      category,
      location: coords,
      status: "pending",
      createdAt: new Date(),
    });
    alert("Request sent successfully!");
  } catch (error) {
    console.error("Error sending request:", error);
    alert("Failed to send request. Try again.");
  }
};

const ServiceRequest = () => {
  const { categoryName } = useParams();
  const userId = auth.currentUser?.uid;

  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(""); // store city instead of full address
  const [availableHelpers, setAvailableHelpers] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    setLoading(true);
    setShowPopup(false);
    console.log("📍 Requesting location access...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log("✅ Got coordinates:", coords);
        setLocation(coords);

        const detectedCity = await reverseGeocodeCity(coords.lat, coords.lng);
        console.log("✅ Detected city:", detectedCity);
        setCity(detectedCity);

        const helpers = await getHelpersByCategoryAndLocation(categoryName, detectedCity);
        console.log("✅ Found helpers:", helpers);
        setAvailableHelpers(helpers);

        setLoading(false);
      },
      (err) => {
        console.error("❌ Location error:", err);
        alert("Location access denied or unavailable.");
        setLoading(false);
        setShowPopup(true);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-green-400 via-blue-500 to-indigo-900 text-white p-6 mt-12 relative">

      {/* --- City Display --- */}
      {city && !showPopup && (
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-md text-sm">
          📍 {city}
        </div>
      )}

      {/* --- Custom Popup --- */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-xl font-bold mb-3">Location Access Required</h2>
            <p className="text-gray-700 mb-5">
              To find helpers for {categoryName}, please allow location access.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAllowLocation}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Allow
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      {loading ? (
        <p className="text-center text-lg mt-20">Detecting your location...</p>
      ) : (
        !showPopup && (
          <>
            <h2 className="text-3xl font-bold mb-3 text-center">{categoryName} Helpers</h2>
            <p className="text-center mb-6 text-lg opacity-80">
              Searching for helpers in your area...
            </p>

            {availableHelpers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableHelpers.map((helper) => (
                  <div
                    key={helper.id}
                    className="bg-white/20 p-4 rounded text-white border border-white/30 shadow-md"
                  >
                    <h2 className="font-bold text-lg">{helper.name || "Unnamed"}</h2>
                    <p>Service: {helper.service}</p>
                    <p>Area: {helper.location}</p>
                    <button
                      onClick={() =>
                        sendRequestToHelper(helper.id, userId, categoryName, location)
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
