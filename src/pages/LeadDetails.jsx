import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../api";

export default function LeadDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [lead, setLead] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/leads/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => setLead(res.data));
  }, []);

  if (!lead) return null;

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Lead Details</h3>
      </div>

      <div className="cardItem">
        <h4>{lead.business_name}</h4>
        <p>{lead.mobile}</p>
        <p>{lead.address}</p>
        <span className="roleTag">{lead.status}</span>
      </div>

    </div>
  );
}
