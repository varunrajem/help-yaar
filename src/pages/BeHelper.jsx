import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const BeHelper = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
  });

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  // submit form
  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.service) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "helperRequests"), {
        ...form,
        image: preview, // ⚠️ later replace with Firebase Storage URL
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Request submitted for approval!");

      // reset form
      setForm({
        name: "",
        phone: "",
        address: "",
        service: "",
      });
      setPreview(null);
      setFileName("No file chosen");

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-700 flex items-center justify-center px-4">

      {/* Card */}
      <div className="backdrop-blur-lg bg-white/90 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-white/30 m-20">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
          Become a Helper 🚀
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Start earning by helping people nearby
        </p>

        <div className="space-y-5">

          {/* IMAGE UPLOAD */}
          <div className="flex flex-col items-center">

            <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-3 border-4 border-indigo-200 shadow">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                  Upload
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              id="fileUpload"
              onChange={handleImageChange}
              className="hidden"
            />

            <label
              htmlFor="fileUpload"
              className="cursor-pointer px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition text-sm"
            >
              Choose Photo
            </label>

            <p className="text-xs text-gray-500 mt-2">{fileName}</p>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Select Service</option>
              <option>Plumbing</option>
              <option>Cleaning</option>
              <option>Electrician</option>
              <option>Carpenter</option>
              <option>Tutoring</option>
              <option>Delivery</option>
              <option>Coding Help</option>
              <option>Painting</option>
              <option>Cooking</option>
              <option>Car Services</option>
              <option>Event Assistance</option>
            </select>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 
            text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Submit Request
          </button>

        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Your request will be reviewed by admin before approval. Visit Nearest Help-Yaar HUB for approval.
        </p>

      </div>
    </div>
  );
};

export default BeHelper;