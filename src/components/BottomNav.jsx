import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, IndianRupee, Users, ClipboardList, Plus } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    if (document.activeElement) document.activeElement.blur();
    window.getSelection()?.removeAllRanges();
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <>
      {/* 🔥 NAV BAR */}
      <div style={styles.nav}>
        <div style={styles.icon(location.pathname === "/dashboard")} onClick={() => handleNav("/dashboard")}>
          <Home size={22} />
        </div>

        <div style={styles.icon(location.pathname === "/orders")} onClick={() => handleNav("/orders")}>
          <Package size={22} />
        </div>

        <div style={styles.icon(location.pathname === "/price")} onClick={() => handleNav("/price")}>
          <IndianRupee size={22} />
        </div>

        <div style={styles.icon(location.pathname === "/leads")} onClick={() => handleNav("/leads")}>
          <Users size={22} />
        </div>

        <div style={styles.icon(location.pathname === "/worksheet")} onClick={() => handleNav("/worksheet")}>
          <ClipboardList size={22} />
        </div>
      </div>

      {/* 🔥 FLOATING BUTTONS */}

      {location.pathname === "/orders" && (
        <div style={styles.fab} onClick={() => handleNav("/order")}>
          <Plus size={26} />
        </div>
      )}

      {location.pathname === "/price" && (
        <div style={styles.fab} onClick={() => handleNav("/add-product")}>
          <Plus size={26} />
        </div>
      )}

      {location.pathname === "/leads" && (
        <div style={styles.fab} onClick={() => handleNav("/add-lead")}>
          <Plus size={26} />
        </div>
      )}

      {location.pathname === "/worksheet" && (
        <div style={styles.fab} onClick={() => handleNav("/add-worksheet")}>
          <Plus size={26} />
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
    width: "95%",
    maxWidth: 450,
    height: 65,
    borderRadius: 20,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    zIndex: 100
  },

  icon: (active) => ({
    width: 45,
    height: 45,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: active ? "#2563eb" : "#666",
    background: active ? "rgba(37,99,235,0.1)" : "transparent",
    outline: "none",
    WebkitTapHighlightColor: "transparent"
  }),

  fab: {
    position: "fixed",
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 200,
    WebkitTapHighlightColor: "transparent"
  }
};