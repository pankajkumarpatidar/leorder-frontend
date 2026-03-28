import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Package,
  ShoppingBag,
  User
} from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();

  const nav = [
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/leads", icon: <BarChart3 size={20} />, label: "Leads" },
    { path: "/orders", icon: <Package size={20} />, label: "Orders" },
    { path: "/products", icon: <ShoppingBag size={20} />, label: "Products" },
    { path: "/users", icon: <User size={20} />, label: "Users" },
  ];

  return (
    <div className="bottomNav">
      {nav.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={pathname === item.path ? "navItem active" : "navItem"}
        >
          {item.icon}
          <p>{item.label}</p>
        </Link>
      ))}
    </div>
  );
}