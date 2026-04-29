import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const HelpersList = () => {
  const [helpers, setHelpers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImage, setNewImage] = useState(null);

  const fetchHelpers = async () => {
    const snapshot = await getDocs(collection(db, "helpers"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setHelpers(list);
  };

  useEffect(() => {
    fetchHelpers();
  }, []);

  const deleteHelper = async (id) => {
    if (!window.confirm("Delete this helper?")) return;
    await deleteDoc(doc(db, "helpers", id));
    fetchHelpers();
  };

  const startEdit = (helper) => {
    setEditingId(helper.id);
    setEditData(helper);
    setNewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  const saveEdit = async () => {
    let imageUrl = editData.image || "";

    if (newImage) {
      const storageRef = ref(
        storage,
        `helpers/${Date.now()}_${newImage.name}`
      );
      await uploadBytes(storageRef, newImage);
      imageUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "helpers", editingId), {
      ...editData,
      image: imageUrl,
    });

    setEditingId(null);
    fetchHelpers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-10 text-center tracking-wide">
        All Helpers
      </h2>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition duration-300"
          >

            {editingId === helper.id ? (
              // ✏️ EDIT MODE (Premium Form)
              <div className="space-y-3">

                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full p-2 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
                  placeholder="Name"
                />

                <input
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full p-2 rounded-xl bg-gray-800 border border-gray-700"
                  placeholder="Email"
                />

                <input
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                  className="w-full p-2 rounded-xl bg-gray-800 border border-gray-700"
                  placeholder="Phone"
                />

                <input
                  value={editData.service}
                  onChange={(e) =>
                    setEditData({ ...editData, service: e.target.value })
                  }
                  className="w-full p-2 rounded-xl bg-gray-800 border border-gray-700"
                  placeholder="Service"
                />

                <input
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  className="w-full p-2 rounded-xl bg-gray-800 border border-gray-700"
                  placeholder="Address"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* AVATAR */}
                <div className="flex justify-center mb-4">
                  <div className="p-[2px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <img
                      src={helper.image || "/default-user.png"}
                      alt="helper"
                      className="w-24 h-24 rounded-full object-cover bg-gray-800"
                    />
                  </div>
                </div>

                {/* NAME */}
                <h3 className="text-lg font-semibold">
                  {helper.name}
                </h3>

                {/* SERVICE */}
                <p className="text-xs text-blue-400 mt-1 mb-3 uppercase tracking-wider">
                  {helper.service}
                </p>

                {/* INFO */}
                <div className="text-sm text-gray-400 space-y-1 mb-4">
                  <p>{helper.email}</p>
                  <p>{helper.phone}</p>
                  <p className="text-gray-500 text-xs">
                    {helper.address}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(helper)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteHelper(helper.id)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default HelpersList;