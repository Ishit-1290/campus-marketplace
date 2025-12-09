// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Home page - user:", user, "loadingAuth:", loadingAuth);

    if (!loadingAuth) {
      if (!user) {
        navigate("/login");
      } else if (user.role === "seller") {
        navigate("/products");
      }
    }
  }, [loadingAuth, user, navigate]);

  if (loadingAuth) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <main className="container">
      <h1>Welcome to Campus Marketplace</h1>
      <p className="lead">Buy and sell items within your campus community.</p>

      {/* If user is not auto-redirected (buyer or other role) */}
      {user?.role === "buyer" && (
        <>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </>
      )}
    </main>
  );
}
