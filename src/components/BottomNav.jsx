import { useLocation, useNavigate } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Orders", path: "/orders", icon: "📦" },
    { name: "Create", path: "/order", icon: "➕" },
    { name: "Leads", path: "/leads", icon: "📋" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <div style={styles.nav}>
      {tabs.map((tab) => (
        <div
          key={tab.name}
          onClick={() => navigate(tab.path)}
          style={{
            ...styles.tab,
            color:
              location.pathname === tab.path ? "#7b2ff7" : "#999",
          }}
        >
          <div style={styles.icon}>{tab.icon}</div>
          <div style={styles.text}>{tab.name}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    background: "#fff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxShadow: "0 -5px 15px rgba(0,0,0,0.1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: {
    textAlign: "center",
    fontSize: 12,
    cursor: "pointer",
  },
  icon: {
    fontSize: 20,
  },
  text: {
    fontSize: 11,
  },
};

export default BottomNav;