import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Store,
  Package,
  ClipboardList,
  User,
  Plus
} from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const nav = [
    { path: "/", icon: Home, label: "Home" },

    // Retailers
    { path: "/retailers", icon: Store, label: "Retailers", add: true },

    // Orders
    { path: "/orders", icon: Package, label: "Orders", add: true },

    // Daily Work (Worksheet)
    { path: "/worksheet", icon: ClipboardList, label: "Work", add: true },

    // Profile
    { path: "/profile", icon: User, label: "Profile" }
  ];

  return (
    <div className="bottomNav">
      {nav.map((item) => {
        const Icon = item.icon;

        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/");

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`navItem ${isActive ? "active" : ""}`}
            style={{ position: "relative" }}
          >
            <Icon size={22} />
            <p>{item.label}</p>

            {/* 🔥 FLOATING ADD ICON */}
            {item.add && (
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#2563eb",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 10
                }}
              >
                <Plus size={10} />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}