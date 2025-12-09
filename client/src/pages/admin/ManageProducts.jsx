// src/pages/admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get("/products")
      .then(res => {
        const payload = res.data.products ?? res.data;
        setProducts(payload);
      }).catch(() => {});
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.product_id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <main className="container">
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div className="card" key={p.product_id}>
            <h3>{p.title ?? p.name}</h3>
            <p>₹{p.price}</p>
            <div className="product-actions">
              <Link to={`/product/${p.product_id}`} className="btn btn-small">View</Link>
              <Link to={`/edit-product/${p.product_id}`} className="btn btn-small">Edit</Link>
              <button className="btn btn-small" onClick={() => remove(p.product_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
