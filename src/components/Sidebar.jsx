export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2>⚡ LeadPro</h2>

        <a href="/">Dashboard</a>
        <a href="/leads">Leads</a>
        <a href="/retailers">Retailers</a>
        <a href="/orders">Orders</a>
        <a href="/products">Products</a>
        <a href="/worksheet">Worksheet</a>
        <a href="/users">Users</a>
      </div>
    </>
  );
}