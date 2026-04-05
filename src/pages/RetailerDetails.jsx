// ===== FILE: RetailerDetails.jsx =====

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function RetailerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [retailer, setRetailer] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchRetailer();
    fetchHistory();
  }, []);

  const fetchRetailer = async () => {
    const res = await fetch(`${BASE_URL}/retailers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setRetailer(data.data);
  };

  const fetchHistory = async () => {
    const res = await fetch(`${BASE_URL}/audit-logs/retailer/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHistory(data.data || []);
  };

  const deleteRetailer = async () => {
    if (!window.confirm("Delete retailer?")) return;

    await fetch(`${BASE_URL}/retailers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Deleted");
    navigate("/retailers");
  };

  if (!retailer) return <div className="appContainer">Loading...</div>;

  return (
    <div className="appContainer">

      {/* PROFILE */}
      <div className="profileCard">

        <div className="profileAvatar">
          {retailer.business_name?.charAt(0)}
        </div>

        <h2 style={{ fontWeight: "700" }}>
          {retailer.business_name}
        </h2>

        <p>{retailer.mobile}</p>
        <p>{retailer.email}</p>

        <p>{retailer.address}</p>
        <p>{retailer.pincode}</p>

        <span className="roleTag">
          {retailer.gst_status}
        </span>

        {retailer.gst_no && (
          <p>GST: {retailer.gst_no}</p>
        )}

        {/* ACTIONS */}
        <div className="profileActions">

          <button className="primaryBtn">
            Update Retailer
          </button>

          <button className="logoutBtn" onClick={deleteRetailer}>
            Delete Retailer
          </button>

        </div>

      </div>

      {/* HISTORY */}
      <div style={{ marginTop: 20 }}>
        <h4>Activity</h4>

        {history.map((h) => (
          <div key={h.id} className="cardItem">
            <p>{h.action}</p>
            <small>{new Date(h.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>

    </div>
  );
}
