// src/pages/seller/SellerDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get(`/products?seller_id=${user.user_id}`)
      .then(res => {
        const payload = res.data.products ?? res.data;
        setProducts(payload);
      })
      .catch(() => {});
  }, [user]);

  return (
    <main className="container">
      <h2>Your products</h2>
      <Link to="/add-product" className="btn">Add new product</Link>
      <div className="grid">
        {products.map(p => (
          <div key={p.product_id} className="card">
            <h3>{p.title ?? p.name}</h3>
            <p>₹{p.price}</p>
            <div className="product-actions">
              <Link to={`/product/${p.product_id}`} className="btn btn-small">View</Link>
              <Link to={`/edit-product/${p.product_id}`} className="btn btn-small">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
