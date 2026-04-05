// ===== FILE: Retailers.jsx =====

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Retailers() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [retailers, setRetailers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/retailers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setRetailers(data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const filtered = retailers.filter((r) =>
    `${r.business_name} ${r.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Retailers</h3>
        <p>{filtered.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search retailer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="cardItem">
          <p>No retailers found</p>
        </div>
      )}

      {/* LIST */}
      {filtered.map((r) => (
        <div
          key={r.id}
          className="userCard"
          onClick={() => navigate(`/retailers/${r.id}`)}
        >
          <div style={{ maxWidth: "70%" }}>
            <h4>{r.business_name}</h4>
            <p style={{ fontSize: 12 }}>{r.mobile}</p>

            <p style={{ fontSize: 12, color: "#666" }}>
              {r.address}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="roleTag">
              {r.gst_status === "REGISTERED" ? "GST" : "No GST"}
            </span>
          </div>
        </div>
      ))}

      {/* FAB */}
      <button
        className="fabBtn"
        onClick={() => navigate("/add-retailer")}
      >
        +
      </button>

    </div>
  );
}
