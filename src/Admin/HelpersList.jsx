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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">All Helpers</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {editingId === helper.id ? (
              <div className="p-5">
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded bg-gray-800"
                  placeholder="Name"
                />

                <input
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded bg-gray-800"
                  placeholder="Email"
                />

                <input
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded bg-gray-800"
                  placeholder="Phone"
                />

                <input
                  value={editData.service}
                  onChange={(e) =>
                    setEditData({ ...editData, service: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded bg-gray-800"
                  placeholder="Service"
                />

                <input
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded bg-gray-800"
                  placeholder="Address"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mb-2 text-sm"
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-600 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Image Section */}
                <div className="relative">
                  <div className="w-full h-48 bg-gray-800 overflow-hidden rounded-[40px] m-3">
                    {helper.image ? (
                      <img
                        src={helper.image}
                        alt="helper"
                        className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar */}
                  {helper.image && (
                    <div className="absolute -bottom-6 left-6">
                      <img
                        src={helper.image}
                        alt="profile"
                        className="w-14 h-14 rounded-full border-4 border-gray-900 object-cover shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 pt-8">
                  <h3 className="text-xl font-semibold mb-1">
                    {helper.name}
                  </h3>

                  <p className="text-sm text-gray-400">📧 {helper.email}</p>
                  <p className="text-sm text-gray-400">📞 {helper.phone}</p>
                  <p className="text-sm text-gray-400">🛠 {helper.service}</p>
                  <p className="text-sm text-gray-400">📍 {helper.address}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => startEdit(helper)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteHelper(helper.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
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