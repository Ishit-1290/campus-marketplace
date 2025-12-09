// src/pages/products/ProductView.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

export default function ProductView() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) return <div className="container">Loading product...</div>;
  if (!product) return <div className="container">Product not found.</div>;

  const isSeller =
    user?.role === "seller" && user.user_id === product.seller_id;

  const mainImage = product.images?.[0]
    ? `${API_BASE_URL}${product.images[0]}`
    : "/placeholder.png";

  return (
    <main className="container product-view">

      {/* Title + Seller Buttons */}
      <div className="product-title-row">
        <h2>{product.title}</h2>

        {isSeller && (
          <div className="product-actions-header">
            <Link
              to={`/edit-product/${product.product_id}`}
              className="btn btn-secondary"
            >
              Edit
            </Link>

            <button
              className="btn btn-danger"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this product?")) {
                  await api.delete(`/products/${product.product_id}`);
                  navigate("/products");
                }
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="product-details-grid">
        
        <div className="product-image-large">
          <img
            src={mainImage}
            alt={product.title}
            className="product-main-img"
          />
        </div>

        <div className="product-info-section">
          <h3>₹{product.price}</h3>
          <p>{product.description}</p>

          <p>
            <strong>Category:</strong>{" "}
            {product.category_name ? product.category_name : "Uncategorized"}
          </p>

          <p>
            <strong>Quantity:</strong> {product.quantity}
          </p>

          <p>
            <strong>Posted on:</strong>{" "}
            {new Date(product.created_at).toLocaleDateString()}
          </p>

          <hr />

          {!isSeller && user?.role === "buyer" && (
            <>
              <h4>Seller Contact</h4>
              <p>Name: {product.seller_name}</p>
              <p>Email: {product.seller_email}</p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  (window.location.href = `mailto:${product.seller_email}`)
                }
              >
                Contact Seller
              </button>
            </>
          )}

          {isSeller && (
            <div className="seller-info-box">
              <h4>Seller Dashboard Info</h4>
              <p>Status: {product.status}</p>
              <p>
                Updated: {new Date(product.updated_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {product.images?.length > 1 && (
        <div className="product-thumbnails">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={`${API_BASE_URL}${img}`}
              alt=""
              className="thumbnail-img"
            />
          ))}
        </div>
      )}
    </main>
  );
}
