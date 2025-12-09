// src/pages/products/ProductsList.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

export default function ProductsList() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        let url = "/products";

        // If seller → fetch only their own products
        if (user && user.role === "seller") {
          url = `/products?seller_id=${user.user_id}`;
        }

        const res = await api.get(url);
        const payload = res.data.products ?? res.data;

        setProducts(payload);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [user]);

  if (loading) return <div className="container">Loading products...</div>;

  return (
    <main className="container">

      {/* Title + Add Product Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {user?.role === "seller" ? "My Products" : "Products"}
        </h2>

        {user?.role === "seller" && (
          <Link to="/add-product" className="btn btn-primary">
            Add New Product
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid">
        {products.length === 0 && (
          <p>
            {user?.role === "seller"
              ? "You haven't added any products yet."
              : "No products found."}
          </p>
        )}

        {products.map((p) => (
          <div className="card product-card" key={p.product_id}>
            <img
              src={
                p.images?.[0]
                  ? `${API_BASE_URL}${p.images[0]}`
                  : "/placeholder.png"
              }
              alt={p.title || "Product Image"}
              className="product-card-img"
            />

            <div className="product-info">
              <h3>{p.title}</h3>
              <p className="price">₹{p.price}</p>

              <div className="product-actions">
                <Link to={`/product/${p.product_id}`} className="btn btn-small">
                  View
                </Link>

                {/* Only seller of this product can edit */}
                {user?.role === "seller" && user.user_id === p.seller_id && (
                  <Link
                    to={`/edit-product/${p.product_id}`}
                    className="btn btn-small btn-secondary"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
