// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    nav("/login");
  };
  if(useLocation().pathname === '/login' || useLocation().pathname === '/register'){
    return null; 
  }

  return (
    <header className="nav">
       
       
        <div className="container nav-inner">
        <Link to="/" className="brand">Campus Marketplace</Link>

        <nav className="nav-links">
          <Link to="/products">Products</Link>
          {user && user.role === "admin" && <Link to="/admin">Admin</Link>}

          {!user ? (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-outline">Register</Link>
            </>
          ) : (
            <>
              <span className="user-pill">{user.name}</span>
              <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
       
      
      
    </header>
  );
}
