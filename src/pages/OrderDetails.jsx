// ===== FILE: OrderDetails.jsx =====

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function OrderDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => {
        setOrder(res.data.order);
        setItems(res.data.items);
      });
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Delete order?")) return;

    await fetch(`${BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/orders");
  };

  const handleApprove = async () => {
    await fetch(`${BASE_URL}/orders/approve/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Approved");
    navigate(0);
  };

  if (!order) return null;

  return (
    <div className="appContainer">

      <div className="highlightCard">
        <p>Total</p>
        <h2>₹ {Math.round(order.total)}</h2>
      </div>

      {items.map(i => (
        <div key={i.id} className="cardItem">
          <h4>{i.product_name}</h4>
          <p>Qty: {i.qty}</p>
          <h3>₹ {Math.round(i.total)}</h3>
        </div>
      ))}

      <div className="profileActions">

        {order.status === "PENDING" && (
          <button className="primaryBtn" onClick={handleApprove}>
            Approve
          </button>
        )}

        <button
          className="logoutBtn"
          onClick={handleDelete}
        >
          Delete
        </button>

      </div>

    </div>
  );
}
