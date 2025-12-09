// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users")
      .then(res => {
        const payload = res.data.users ?? res.data;
        setUsers(payload);
      }).catch(() => {});
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.user_id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <main className="container">
      <h2>Users</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><button className="btn btn-small" onClick={() => remove(u.user_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
