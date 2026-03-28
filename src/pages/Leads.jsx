import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function Leads() {
  const token = localStorage.getItem("token");

  const [leads, setLeads] = useState([]);
  const [brands, setBrands] = useState([]);
  const [retailers, setRetailers] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    mobile: "",
    brand_id: "",
    retailer_id: "",
    status: "new",
  });

  // ===== FETCH =====
  const fetchData = async () => {
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

      const l = await leadRes.json();
      const b = await brandRes.json();
      const r = await retailerRes.json();

      setLeads(l.data || []);
      setBrands(b.data || []);
      setRetailers(r.data || []);
    } catch {
      showToast("Error loading");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ===== CREATE / UPDATE =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      return showToast("Invalid mobile");
    }

    try {
      const url = editId
        ? `${BASE_URL}/leads/${editId}`
        : `${BASE_URL}/leads`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        showToast(editId ? "Updated" : "Created");
        setShow(false);
        setEditId(null);
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

  // ===== EDIT =====
  const handleEdit = (l) => {
    setForm({
      mobile: l.mobile,
      brand_id: l.brand_id || "",
      retailer_id: l.retailer_id || "",
      status: l.status,
    });
    setEditId(l.id);
    setShow(true);
  };

  // ===== FILTER + SEARCH =====
  let filtered = leads.filter((l) =>
    `${l.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (filter !== "all") {
    filtered = filtered.filter((l) => l.status === filter);
  }

  // ===== SORT (pending/top) =====
  const order = { new: 1, followup: 2, closed: 3 };

  filtered.sort((a, b) => order[a.status] - order[b.status]);

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Leads</h3>
        <p>{filtered.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {["all", "new", "followup", "closed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "none",
              background: filter === f ? "#2563eb" : "#eee",
              color: filter === f ? "white" : "black",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p style={{ marginTop: 20 }}>No leads</p>
      ) : (
        filtered.map((l) => (
          <div key={l.id} className="userCard">

            <div>
              <h4>{l.mobile}</h4>

              <p>
                {brands.find(b => b.id === l.brand_id)?.name || "-"}
              </p>

              <span className="roleTag">{l.status}</span>
            </div>

            <div className="actionBtns">
              <button onClick={() => handleEdit(l)}>Edit</button>
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

            <h3>{editId ? "Edit Lead" : "Add Lead"}</h3>

            <form onSubmit={handleSubmit}>

              <input
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <select
                value={form.brand_id}
                onChange={(e) =>
                  setForm({ ...form, brand_id: e.target.value })
                }
              >
                <option value="">Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <select
                value={form.retailer_id}
                onChange={(e) =>
                  setForm({ ...form, retailer_id: e.target.value })
                }
              >
                <option value="">Retailer</option>
                {retailers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.business_name}
                  </option>
                ))}
              </select>

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

              <button type="submit">
                {editId ? "Update" : "Create"}
              </button>

            </form>

            <button className="closeBtn" onClick={() => {
              setShow(false);
              setEditId(null);
            }}>
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