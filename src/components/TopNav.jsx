import { Menu, User, Settings } from "lucide-react";

export default function TopNav() {
  return (
    <div style={styles.container}>
      
      {/* LEFT - MENU + LOGO */}
      <div style={styles.left}>
        <Menu size={24} style={{ cursor: "pointer" }} />

        <div style={styles.logo}>
          LEORDER
        </div>
      </div>

      {/* RIGHT - PROFILE + SETTINGS */}
      <div style={styles.right}>
        <User size={22} style={styles.icon} />
        <Settings size={22} style={styles.icon} />
      </div>

    </div>
  );
}

const styles = {
  container: {
    position: "sticky",
    top: 0,
    width: "100%",
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(20px)",
    zIndex: 999,
    borderBottom: "1px solid #eee"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  logo: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2563eb"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 15
  },

  icon: {
    cursor: "pointer"
  }
};