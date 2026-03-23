import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Orders", path: "/orders", icon: "📦" },
    { name: "Price", path: "/price", icon: "💰" },
    { name: "Profile", path: "/profile", icon: "👤" }
  ];

  return (
    <>
      {/* 🔥 Floating Glass Nav */}
      <div style={styles.container}>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.item,
              ...(location.pathname === item.path && styles.active)
            }}
          >
            <div style={styles.icon}>{item.icon}</div>
            <small>{item.name}</small>
          </div>
        ))}
      </div>

      {/* 🔥 Floating + Button */}
      <div style={styles.fab} onClick={() => navigate("/order")}>
        +
      </div>
    </>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: 420,
    height: 70,
    borderRadius: 25,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    // 🧊 Glass Effect
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    zIndex: 100
  },

  item: {
    textAlign: "center",
    color: "#555",
    cursor: "pointer",
    fontSize: 13,
    transition: "0.2s"
  },

  icon: {
    fontSize: 20
  },

  active: {
    color: "#2563eb",
    transform: "scale(1.1)"
  },

  fab: {
    position: "fixed",
    bottom: 55,
    left: "50%",
    transform: "translateX(-50%)",
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    fontSize: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 200
  }
};