import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Leads() {
  const token = localStorage.getItem("token");

  const [leads, setLeads] = useState([]);
  const [brands, setBrands] = useState([]);
  const [retailers, setRetailers] = useState([]);

  const [show, setShow] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    brand_id: "",
    retailer_id: "",
    status: "new",
  });

  // ===== FETCH ALL =====
  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadRes, brandRes, retailerRes] = await Promise.all([
        fetch(`${BASE_URL}/leads`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/brands`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/retailers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const leadsData = await leadRes.json();
      const brandData = await brandRes.json();
      const retailerData = await retailerRes.json();

      setLeads(leadsData.data || []);
      setBrands(brandData.data || []);
      setRetailers(retailerData.data || []);

    } catch {
      showToast("Error loading data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== TOAST =====
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ===== CREATE =====
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
        showToast("Lead created");
        setShow(false);
        setForm({
          mobile: "",
          brand_id: "",
          retailer_id: "",
          status: "new",
        });
        fetchData();
      } else {
        showToast(data.message);
      }
    } catch {
      showToast("Error");
    }
  };

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Leads</h3>
        <p>{leads.length}</p>
      </div>

      {/* LIST */}
      {loading ? (
        <p style={{ marginTop: 20 }}>Loading...</p>
      ) : leads.length === 0 ? (
        <p style={{ marginTop: 20 }}>No leads</p>
      ) : (
        leads.map((l) => (
          <div key={l.id} className="userCard">

            <div>
              <h4>{l.mobile}</h4>
              <p>
                Brand: {brands.find(b => b.id === l.brand_id)?.name || "-"}
              </p>
              <p>
                Retailer: {retailers.find(r => r.id === l.retailer_id)?.business_name || "-"}
              </p>

              <span className="roleTag">{l.status}</span>
            </div>

          </div>
        ))
      )}

      {/* FAB */}
      <button className="fabBtn" onClick={() => setShow(true)}>+</button>

      {/* MODAL */}
      {show && (
        <div className="modal">
          <div className="modalBox">

            <h3>Add Lead</h3>

            <form onSubmit={handleSubmit}>

              <input
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              {/* BRAND */}
              <select
                value={form.brand_id}
                onChange={(e) =>
                  setForm({ ...form, brand_id: e.target.value })
                }
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* RETAILER */}
              <select
                value={form.retailer_id}
                onChange={(e) =>
                  setForm({ ...form, retailer_id: e.target.value })
                }
              >
                <option value="">Select Retailer (optional)</option>
                {retailers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.business_name}
                  </option>
                ))}
              </select>

              {/* STATUS */}
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="new">New</option>
                <option value="followup">Followup</option>
                <option value="closed">Closed</option>
              </select>

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