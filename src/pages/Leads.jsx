import { useEffect, useState } from "react";
import axios from "axios";

export default function Leads() {
  const [leads, setLeads] = useState([]);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await axios.get(`${API}/api/lead/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLeads(res.data.data || res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `${API}/api/lead/status/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchLeads();
  };

  return (
    <div style={styles.container}>
      <h2>Leads</h2>

      {leads.map((l) => (
        <div key={l.id} style={styles.card}>
          <h4>{l.name}</h4>
          <p>{l.mobile}</p>
          <p>Status: {l.status}</p>

          {l.status === "pending" && (
            <div style={styles.btnRow}>
              <button onClick={() => updateStatus(l.id, "approved")}>
                Approve
              </button>
              <button onClick={() => updateStatus(l.id, "rejected")}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: 15,
    padding: 70,
    paddingBottom: 80,
  },
  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  btnRow: {
    display: "flex",
    gap: 10,
  },
};