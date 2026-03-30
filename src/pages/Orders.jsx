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
      console.log(err);
    }
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Orders</h3>
        <p>Total: {orders.length}</p>
      </div>

      <div className="highlightCard">
        <p>Total Orders</p>
        <h2>{orders.length}</h2>
      </div>

      {/* 🔥 EMPTY FIX */}
      {orders.length === 0 && (
        <div className="cardItem">
          <p>No orders yet</p>
        </div>
      )}

      {orders.map((o) => (
        <div
          key={o.id}
          className="userCard"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          <div>
            <h4>{o.retailer_name || "Walk-in"}</h4>
            <p>₹ {o.total}</p>
          </div>

          <div>
            <small>{o.payment_type}</small>
            {o.is_overdue && (
              <span style={{ color: "red" }}>Overdue</span>
            )}
          </div>
        </div>
      ))}

      <Fab onClick={() => navigate("/add-order")} />
    </div>
  );
}