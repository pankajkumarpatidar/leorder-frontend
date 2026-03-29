import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Store,
  Package,
  ClipboardList,
  User
} from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const nav = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/retailers", icon: Store, label: "Retailers" },
    { path: "/orders", icon: Package, label: "Orders" },
    { path: "/worksheet", icon: ClipboardList, label: "Work" },
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
            style={{
              flex: 1, // 🔥 equal spacing
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px" // 🔥 icon + text spacing
            }}
          >
            <Icon size={22} />
            <p style={{ margin: 0 }}>{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
}