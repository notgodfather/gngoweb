import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const emptyForm = {
  name: "",
  categoryId: "",
  price: "",
  description: "",
  imageUrl: "",
  isAvailable: true,
};

const AdminMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const snap = await getDocs(collection(db, "menu"));
      setMenuItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchCats = async () => {
      const snap = await getDocs(collection(db, "categories"));
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchItems();
    fetchCats();
  }, [modalOpen]); // refetch after closing modal

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "menu", id));
    setMenuItems(items => items.filter(i => i.id !== id));
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      categoryId: item.categoryId || "",
      price: item.price || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable !== false,
    });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.categoryId ||
      !form.price ||
      !form.description ||
      !form.imageUrl
    ) {
      alert("Please complete all fields.");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        // Update
        await updateDoc(doc(db, "menu", editId), {
          ...form,
          price: Number(form.price),
          isAvailable: !!form.isAvailable,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add
        await addDoc(collection(db, "menu"), {
          ...form,
          price: Number(form.price),
          isAvailable: !!form.isAvailable,
          createdAt: serverTimestamp(),
        });
      }
      setModalOpen(false);
      setEditId(null);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Manage Menu Items</h1>
      <button className="orange-btn" style={{ float: "right", marginBottom: 12 }} onClick={openAdd}>
        + Add New Item
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => {
            const cat = categories.find(c => c.id === item.categoryId);
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{cat ? cat.name : "Unknown"}</td>
                <td>₹{(item.price || 0).toFixed(2)}</td>
                <td>{item.isAvailable ? "Yes" : "No"}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(item)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">
              {editId ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Item Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="modal-input"
                  autoFocus
                />
              </label>
              <label>
                Category
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="modal-input"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Price (INR)
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="modal-input"
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  rows={2}
                  onChange={handleChange}
                  required
                  className="modal-input"
                />
              </label>
              <label>
                Image URL
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  required
                  className="modal-input"
                />
              </label>
              <div className="modal-checkbox-row">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />
                <label htmlFor="isAvailable">Is Available?</label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => {
                    setModalOpen(false);
                    setEditId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="orange-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminMenuItems;
