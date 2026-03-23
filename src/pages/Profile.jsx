import React from "react";

export default function Profile() {
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

        <div style={styles.avatar}>
          {name.charAt(0).toUpperCase()}
        </div>

        <h2>{name}</h2>
        <p style={styles.email}>{email}</p>

        <div style={styles.info}>
          <span>Role:</span>
          <strong>{role}</strong>
        </div>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}


// 🎨 STYLES
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  card: {
    width: "100%",
    maxWidth: 350,
    padding: 25,
    borderRadius: 20,
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center"
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 28,
    margin: "0 auto 10px"
  },

  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15
  },

  info: {
    marginBottom: 20
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