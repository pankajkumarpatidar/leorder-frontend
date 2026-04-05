// ===== FILE: ProductDetails.jsx =====

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function ProductDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [p, setP] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => setP(res.data));
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Delete product?")) return;

    await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/products");
  };

  if (!p) return null;

  return (
    <div className="appContainer">

      <div className="cardItem">
        <h4>{p.name}</h4>

        <p>MRP: ₹ {p.mrp_small}</p>
        <p>DP: ₹ {p.dp_small}</p>

        <p>
          {p.unit_big} → {p.conversion} {p.unit_small}
        </p>
      </div>

      <div className="profileActions">

        <button
          className="primaryBtn"
          onClick={() => navigate(`/products/edit/${id}`)}
        >
          Edit
        </button>

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
