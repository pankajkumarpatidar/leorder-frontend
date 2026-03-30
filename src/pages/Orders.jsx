import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Orders() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.log("Orders error", err);
    }
  };

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>📋 Orders</h3>
        <p>Total: {orders.length}</p>
      </div>

      {/* SUMMARY */}
      <div className="highlightCard">
        <p>Total Orders</p>
        <h2>{orders.length}</h2>
      </div>

      {/* LIST */}
      {orders.map((o) => (
        <div
          key={o.id}
          className="userCard"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          <h4>{o.retailer_name || "Walk-in"}</h4>

          <p>₹ {o.total}</p>

          <div style={{ display: "flex", gap: 10 }}>
            <small>{o.payment_type}</small>
            <small>{o.status}</small>
          </div>

          {/* 🔥 OVERDUE */}
          {o.is_overdue && (
            <p style={{ color: "red" }}>Overdue</p>
          )}

          {/* DUE DATE */}
          {o.due_date && (
            <small>
              Due: {new Date(o.due_date).toDateString()}
            </small>
          )}
        </div>
      ))}

      {/* ➕ ADD ORDER */}
      <Fab onClick={() => navigate("/add-order")} />

    </div>
  );
}