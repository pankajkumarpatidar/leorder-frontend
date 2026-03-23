import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: "/dashboard", icon: "🏠" },
    { path: "/orders", icon: "📦" },
    { path: "/price", icon: "💰" },
    { path: "/profile", icon: "👤" }
  ];

  const handleNav = (path) => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
    document.body.focus();
    navigate(path);
  };

  return (
    <>
      {/* 🧊 Floating Glass Nav */}
      <div style={styles.nav}>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => handleNav(item.path)}
            style={{
              ...styles.iconBox,
              ...(location.pathname === item.path && styles.active)
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* 🔥 Center FAB */}
      <div style={styles.fab} onClick={() => handleNav("/order")}>
        +
      </div>
    </>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "85%",
    maxWidth: 420,
    height: 65,
    borderRadius: 40,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    zIndex: 100
  },

  iconBox: {
    fontSize: 22,
    color: "#555",
    cursor: "pointer",
    transition: "0.3s",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12
  },

  active: {
    background: "rgba(37,99,235,0.1)",
    color: "#2563eb",
    transform: "scale(1.2)"
  },

  fab: {
    position: "fixed",
    bottom: 50,
    left: "50%",
    transform: "translateX(-50%)",
    width: 65,
    height: 65,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    fontSize: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 200,
    border: "4px solid white" // 🔥 floating cut effect
  }
};