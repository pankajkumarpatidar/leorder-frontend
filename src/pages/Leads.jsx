import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Leads() {
  const token = localStorage.getItem("token");

  const [leads, setLeads] = useState([]);
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    brand_id: "",
  });

  // ===== FETCH LEADS =====
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeads(data.data || []);
    } catch {
      showToast("Error fetching leads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ===== TOAST =====
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ===== CREATE LEAD =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      return showToast("Invalid mobile");
    }

    try {
      const res = await fetch(`${BASE_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Lead added");
        setShow(false);
        setForm({ mobile: "", brand_id: "" });
        fetchLeads();
      } else {
        showToast(data.message);
      }
    } catch {
      showToast("Error creating lead");
    }
  };

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Leads</h3>
        <p>Total: {leads.length}</p>
      </div>

      {/* LIST */}
      {loading ? (
        <p style={{ marginTop: 20 }}>Loading...</p>
      ) : leads.length === 0 ? (
        <p style={{ marginTop: 20 }}>No leads found</p>
      ) : (
        leads.map((l) => (
          <div key={l.id} className="userCard">
            <div>
              <h4>{l.mobile}</h4>
              <p>Status: {l.status}</p>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <Fab onClick={() => setShow(true)} />

      {/* MODAL */}
      {show && (
        <div className="modal">
          <div className="modalBox">

            <h3>Add Lead</h3>

            <form onSubmit={handleSubmit}>

              <input
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <input
                placeholder="Brand ID"
                value={form.brand_id}
                onChange={(e) =>
                  setForm({ ...form, brand_id: e.target.value })
                }
              />

              <button type="submit">Create Lead</button>

            </form>

            <button className="closeBtn" onClick={() => setShow(false)}>
              Close
            </button>

          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}