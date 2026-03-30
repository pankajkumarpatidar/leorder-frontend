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
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setOrders(data.data || []);
  };

  return (
    <div className="appContainer" style={{ paddingBottom: 80 }}>

      <div className="header">
        <h3>📋 Orders</h3>
        <p>Total: {orders.length}</p>
      </div>

      <div className="highlightCard">
        <p>Total Orders</p>
        <h2>{orders.length}</h2>
      </div>

      {orders.length === 0 && (
        <p style={{ marginTop: 20 }}>No orders yet</p>
      )}

      {orders.map((o) => (
        <div
          key={o.id}
          className="cardItem"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          <h4>{o.retailer_name || "Walk-in"}</h4>

          <p>₹ {o.total}</p>

          <div className="row">
            <small>{o.payment_type}</small>
            <small>{o.status}</small>
          </div>

          {o.is_overdue && (
            <span style={{ color: "red" }}>Overdue</span>
          )}

          {o.due_date && (
            <small>
              Due: {new Date(o.due_date).toDateString()}
            </small>
          )}
        </div>
      ))}

      <Fab onClick={() => navigate("/add-order")} />
    </div>
  );
}