import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const HelpersList = () => {
  const [helpers, setHelpers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔥 Fetch Helpers
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

  // 🗑 DELETE
  const deleteHelper = async (id) => {
    const confirmDelete = window.confirm("Delete this helper?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "helpers", id));
    fetchHelpers();
  };

  // ✏️ START EDIT
  const startEdit = (helper) => {
    setEditingId(helper.id);
    setEditData(helper);
  };

  // 💾 SAVE EDIT
  const saveEdit = async () => {
    await updateDoc(doc(db, "helpers", editingId), {
      name: editData.name,
      email: editData.email, // ✅ added
      phone: editData.phone,
      service: editData.service,
      address: editData.address,
    });

    setEditingId(null);
    fetchHelpers();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">All Helpers</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-xl"
          >
            {editingId === helper.id ? (
              <>
                {/* EDIT MODE */}
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
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <h3 className="text-lg font-semibold">
                  {helper.name}
                </h3>

                <p className="text-gray-400">
                  📧 {helper.email}
                </p>

                <p className="text-gray-400">
                  📞 {helper.phone}
                </p>

                <p className="text-gray-400">
                  🛠 {helper.service}
                </p>

                <p className="text-gray-400">
                  📍 {helper.address}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => startEdit(helper)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteHelper(helper.id)}
                    className="bg-red-600 px-3 py-1 rounded"
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