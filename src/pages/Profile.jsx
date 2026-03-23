import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "user";
  const email = localStorage.getItem("email") || "example@gmail.com";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* 👤 Avatar */}
        <div style={styles.avatar}>
          {name.charAt(0).toUpperCase()}
        </div>

        <h2 style={styles.name}>{name}</h2>
        <p style={styles.email}>{email}</p>

        <div style={styles.role}>
          Role: <strong>{role}</strong>
        </div>

        {/* 🔥 ACTION BUTTONS */}
        <div style={styles.actions}>

          {/* ADMIN ONLY */}
          {role === "admin" && (
            <>
              <button style={styles.btn} onClick={() => navigate("/add-product")}>
                ➕ Add Product
              </button>

              <button style={styles.btn} onClick={() => navigate("/add-user")}>
                👥 Add User
              </button>
            </>
          )}

          {/* ADMIN + STAFF */}
          {(role === "admin" || role === "staff") && (
            <button style={styles.btn} onClick={() => navigate("/add-retailer")}>
              🏪 Add Retailer
            </button>
          )}

        </div>

        {/* 🚪 LOGOUT */}
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}


// 🎨 FINAL RESPONSIVE STYLES
const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px 12px 90px", // 👈 bottom nav space
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box"
  },

  card: {
    width: "100%",
    maxWidth: 380,
    padding: 20,
    borderRadius: 20,
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center"
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    margin: "0 auto 10px"
  },

  name: {
    margin: 0,
    fontSize: 22
  },

  email: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    wordBreak: "break-all"
  },

  role: {
    marginBottom: 15,
    fontSize: 14
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 15
  },

  btn: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 14
  },

  logout: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};