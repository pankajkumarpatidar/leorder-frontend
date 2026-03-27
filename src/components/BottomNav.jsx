import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="bottomNav">

      <Link to="/">🏠</Link>
      <Link to="/leads">📋</Link>
      <Link to="/orders">📦</Link>
      <Link to="/products">🛍</Link>
      <Link to="/users">👤</Link>

    </div>
  );
}