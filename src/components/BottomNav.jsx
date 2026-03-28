import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="bottomNav">

      <Link className={pathname === "/" ? "active" : ""} to="/">
        <span>🏠</span>
        <p>Home</p>
      </Link>

      <Link className={pathname === "/leads" ? "active" : ""} to="/leads">
        <span>📋</span>
        <p>Leads</p>
      </Link>

      <Link className={pathname === "/orders" ? "active" : ""} to="/orders">
        <span>📦</span>
        <p>Orders</p>
      </Link>

      <Link className={pathname === "/products" ? "active" : ""} to="/products">
        <span>🛍</span>
        <p>Products</p>
      </Link>

      <Link className={pathname === "/users" ? "active" : ""} to="/users">
        <span>👤</span>
        <p>Users</p>
      </Link>

    </div>
  );
}