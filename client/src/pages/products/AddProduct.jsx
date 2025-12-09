// src/pages/products/AddProduct.jsx
import React, { useState, useContext, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AddProduct() {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 1,
    category_id: ""
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch categories from backend
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get("/categories");

        // response shape: { success: true, categories: [...] }
        const cats = res.data.categories;

        setCategories(cats);

        // auto-select first category
        if (cats.length) {
          setForm((f) => ({ ...f, category_id: cats[0].category_id }));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load categories");
      }
    }

    loadCategories();
  }, []);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required");
    setLoading(true);

    try {
      const res = await api.post("/products", {
        ...form,
        seller_id: user.user_id
      });

      const created = res.data.product ?? res.data;

      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        await api.post(`/products/${created.product_id}/images`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      nav("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container card">
      
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
        <select
          name="category_id"
          value={form.category_id}
          onChange={change}
          required
        >
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </main>
  );
}
