import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Package,
  ShoppingBag,
  User
} from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const nav = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/leads", icon: BarChart3, label: "Leads" },
    { path: "/orders", icon: Package, label: "Orders" },
    { path: "/products", icon: ShoppingBag, label: "Products" },
    { path: "/users", icon: User, label: "Users" },
  ];

  return (
    <div className="bottomNav">
      {nav.map((item) => {
        const Icon = item.icon;

        // 🔥 ACTIVE FIX (sub routes bhi match kare)
        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/");

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`navItem ${isActive ? "active" : ""}`}
          >
            <Icon size={22} />
            <p>{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
}