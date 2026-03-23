import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, IndianRupee, User, Plus } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    if (document.activeElement) document.activeElement.blur();

    document.querySelectorAll("input, textarea").forEach(el => el.blur());

    window.getSelection()?.removeAllRanges();
    window.scrollTo(0, 0);

    navigate(path);
  };

  return (
    <>
      <div style={styles.nav}>
        
        <div
          style={styles.iconBox(location.pathname === "/dashboard")}
          onClick={() => handleNav("/dashboard")}
        >
          <Home size={22} />
        </div>

        <div
          style={styles.iconBox(location.pathname === "/orders")}
          onClick={() => handleNav("/orders")}
        >
          <Package size={22} />
        </div>

        {/* center gap */}
        <div style={{ width: 60 }} />

        {/* ✅ FIXED PRICE ICON */}
        <div
          style={styles.iconBox(location.pathname === "/price")}
          onClick={() => handleNav("/price")}
        >
          <IndianRupee size={22} />
        </div>

        <div
          style={styles.iconBox(location.pathname === "/profile")}
          onClick={() => handleNav("/profile")}
        >
          <User size={22} />
        </div>
      </div>

      {/* FAB */}
      <div style={styles.fab} onClick={() => handleNav("/order")}>
        <Plus size={26} />
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

  iconBox: (active) => ({
    width: 45,
    height: 45,
    borderRadius: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: active ? "#2563eb" : "#666",
    background: active ? "rgba(37,99,235,0.1)" : "transparent"
  }),

  fab: {
    position: "fixed",
    bottom: 45,
    left: "50%",
    transform: "translateX(-50%)",
    width: 65,
    height: 65,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    color: "#fff",
    cursor: "pointer",
    zIndex: 200,
    border: "4px solid white"
  }
};