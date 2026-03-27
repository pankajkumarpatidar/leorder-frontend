import { Link } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2>⚡ LeadPro</h2>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/leads">Leads</Link>
          <Link to="/retailers">Retailers</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/products">Products</Link>
          <Link to="/worksheet">Worksheet</Link>
          <Link to="/users">Users</Link>
        </nav>
      </div>
    </>
  );
}