// ===== FILE: LeadDetails.jsx =====

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [lead, setLead] = useState(null);

  // ===== LOAD =====
  const load = async () => {
    try {
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setLead(data.data);

    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ===== APPROVE =====
  const approve = async () => {
    await fetch(`${BASE_URL}/leads/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Approved ✅");
    load();
  };

  // ===== REJECT =====
  const reject = async () => {
    await fetch(`${BASE_URL}/leads/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Rejected ❌");
    load();
  };

  if (!lead) return <p>Loading...</p>;

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Lead Details</h3>
      </div>

      <div className="cardItem">
        <h3>{lead.business_name}</h3>
        <p>{lead.person_name}</p>

        <p>📞 {lead.mobile}</p>
        <p>📧 {lead.email}</p>

        <p>📍 {lead.address}</p>
        <p>{lead.city}, {lead.state} - {lead.pincode}</p>

        <p>GST: {lead.gst_status}</p>
        {lead.gst_no && <p>GST No: {lead.gst_no}</p>}

        <p>Status: <b>{lead.status}</b></p>
      </div>

      {/* ACTION BUTTONS */}
      {user.role !== "salesman" && lead.status === "PENDING" && (
        <div className="cardItem">
          <button onClick={approve}>Approve</button>
          <button className="deleteBtn" onClick={reject}>
            Reject
          </button>
        </div>
      )}

      {/* META INFO */}
      <div className="cardItem">
        <p>Created By: {lead.created_by_name}</p>
        <p>Created At: {new Date(lead.created_at).toLocaleString()}</p>

        {lead.approved_at && (
          <>
            <p>Approved By: {lead.approved_by_name}</p>
            <p>Approved At: {new Date(lead.approved_at).toLocaleString()}</p>
          </>
        )}
      </div>

    </div>
  );
}
