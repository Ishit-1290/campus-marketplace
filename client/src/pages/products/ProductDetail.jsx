// src/pages/products/ProductDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product ?? res.data);
      })
      .catch(() => {});
  }, [id]);

  const buy = async () => {
    if (!user) return alert("Please login first");
    try {
      await api.post("/orders", { product_id: product.product_id, quantity: qty });
      alert("Order placed!");
    } catch (e) {
      alert(e.response?.data?.message || "Could not place order");
    }
  };

  if (!product) return <div className="container">Loading...</div>;

  return (
    <main className="container card">
      <div className="product-detail">
        <img src={product.image || product.images?.[0] || "/placeholder.png"} alt={product.title ?? product.name} />
        <div className="product-detail-info">
          <h2>{product.title ?? product.name}</h2>
          <p className="price">₹{product.price}</p>
          <p>{product.description}</p>
          <div className="form-row">
            <label>Quantity</label>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
          <div className="form-row">
            <button className="btn" onClick={buy}>Buy Now</button>
          </div>
        </div>
      </div>
    </main>
  );
}
