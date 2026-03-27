import { motion } from "framer-motion";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* OVERLAY */}
      {open && <div className="overlay" onClick={()=>setOpen(false)} />}

      <motion.div
        initial={{ x: -250 }}
        animate={{ x: open ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="sidebar"
      >
        <h2>⚡ LeadPro</h2>

        <a href="/">📊 Dashboard</a>
        <a href="/leads">📋 Leads</a>
        <a href="/retailers">🏪 Retailers</a>
        <a href="/orders">📦 Orders</a>
        <a href="/products">🛍 Products</a>
        <a href="/worksheet">🧾 Worksheet</a>
        <a href="/users">👥 Users</a>
      </motion.div>
    </>
  );
}