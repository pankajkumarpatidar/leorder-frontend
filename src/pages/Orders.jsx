// ===== FILE: Orders.jsx =====

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Orders() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  // ================= FETCH =================
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // 🔥 SAFE FIX
      const list = Array.isArray(data)
        ? data
        : data.data || [];

      setOrders(list);

    } catch (err) {
      console.log("Order Fetch Error:", err);
    }
  };

  // ================= FILTER =================
  useEffect(() => {
    applyFilter();
  }, [orders, search, paymentFilter, dateFilter]);

  const applyFilter = () => {
    let data = [...orders];

    // 🔍 SEARCH
    if (search) {
      data = data.filter((o) =>
        (o.retailer_name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // 💳 PAYMENT
    if (paymentFilter !== "ALL") {
      data = data.filter((o) => o.payment_type === paymentFilter);
    }

    // 📅 DATE
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dateFilter === "TODAY") {
      data = data.filter((o) => {
        if (!o.created_at) return false;
        return new Date(o.created_at).toDateString() === today.toDateString();
      });
    }

    if (dateFilter === "TOMORROW") {
      data = data.filter((o) => {
        if (!o.created_at) return false;
        return new Date(o.created_at).toDateString() === tomorrow.toDateString();
      });
    }

    setFiltered(data);
  };

  // ================= TOTAL =================
  const totalAmount = filtered.reduce(
    (s, o) => s + Number(o.total || 0),
    0
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Orders</h3>
        <p>Total: {filtered.length}</p>
      </div>

      {/* SUMMARY */}
      <div className="highlightCard">
        <p>Total Orders</p>
        <h2>{filtered.length}</h2>
        <p style={{ marginTop: 6 }}>
          ₹ {Math.round(totalAmount).toLocaleString()}
        </p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search retailer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PAYMENT FILTER */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {["ALL", "CASH", "CREDIT"].map((f) => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              border: "none",
              background:
                paymentFilter === f
                  ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                  : "#eee",
              color: paymentFilter === f ? "white" : "#333",
              fontSize: 12,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* DATE FILTER */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {["ALL", "TODAY", "TOMORROW"].map((f) => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            style={{
              padding: "7px 12px",
              borderRadius: 10,
              border: "none",
              background: dateFilter === f ? "#111" : "#eee",
              color: dateFilter === f ? "white" : "#333",
              fontSize: 11,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="cardItem">
          <p>No orders found</p>
        </div>
      )}

      {/* LIST */}
      {filtered.map((o) => (
        <div
          key={o.id}
          className="userCard"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          <div>
            <h4>{o.retailer_name || "Walk-in"}</h4>

            {/* 🔥 ROUND FIX */}
            <p>₹ {Math.round(o.total || 0).toLocaleString()}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <small>{o.payment_type}</small>

            {o.payment_type === "CREDIT" && (
              <small style={{ display: "block", color: "#999" }}>
                {o.credit_days} days
              </small>
            )}

            {o.is_overdue && (
              <span style={{ color: "red", fontSize: 12 }}>
                Overdue
              </span>
            )}
          </div>
        </div>
      ))}

      {/* FAB */}
      <Fab onClick={() => navigate("/add-order")} />

    </div>
  );
}
