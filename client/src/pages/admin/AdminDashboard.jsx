// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <main className="container">
      <h2>Admin Dashboard</h2>
      <div className="grid-admin">
        <Link to="/admin/users" className="card">Manage Users</Link>
        <Link to="/admin/products" className="card">Manage Products</Link>
      </div>
    </main>
  );
}
