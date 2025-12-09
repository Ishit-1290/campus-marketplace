// src/pages/products/EditProduct.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
    status: "available",
  });

  useEffect(() => {
    async function load() {
      try {
        const cats = await api.get("/categories");
        setCategories(cats.data.categories);

        const res = await api.get(`/products/${id}`);
        const p = res.data.product;

        setForm({
          title: p.title,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
          category_id: p.category_id,
          status: p.status,
        });

        setExistingImages(p.images || []);
      } catch (err) {
        alert("Failed to load product");
      }
    }
    load();
  }, [id]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required");

    setSaving(true);

    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category_id: Number(form.category_id),
      });

      if (newFile) {
        const fd = new FormData();
        fd.append("image", newFile);
        await api.post(`/products/${id}/images`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Product updated!");
      nav(`/product/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container card">
      <h2>Edit Product</h2>

      <form className="form" onSubmit={submit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={change} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={change} />

        <label>Price</label>
        <input name="price" type="number" value={form.price} onChange={change} required />

        <label>Quantity</label>
        <input name="quantity" type="number" value={form.quantity} onChange={change} required />

        <label>Category</label>
        <select name="category_id" value={form.category_id} onChange={change} required>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
        </select>

        <label>Status</label>
        <select name="status" value={form.status} onChange={change}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
        </select>

        {existingImages.length > 0 && (
          <>
            <label>Existing Images</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={`${API_BASE_URL}${img}`}
                  alt=""
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </div>
          </>
        )}

        <label>Upload New Image (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setNewFile(e.target.files[0])} />

        <button className="btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
