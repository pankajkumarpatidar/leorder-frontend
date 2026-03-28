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
  });

  const [statusOnly, setStatusOnly] = useState("new");

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

  // ===== CREATE =====
  const createLead = async () => {
    const res = await fetch(`${BASE_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    return res.json();
  };

  // ===== UPDATE STATUS =====
  const updateLead = async () => {
    const res = await fetch(`${BASE_URL}/leads/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: statusOnly }),
    });

    return res.json();
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      return showToast("Invalid mobile");
    }

    try {
      const data = editId ? await updateLead() : await createLead();

      if (data.success) {
        showToast(editId ? "Status updated" : "Lead created");
        setShow(false);
        setEditId(null);
        setForm({ mobile: "", brand_id: "", retailer_id: "" });
        setStatusOnly("new");
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
    setEditId(l.id);
    setStatusOnly(l.status);
    setShow(true);
  };

  // ===== FILTER =====
  let filtered = leads.filter((l) =>
    l.mobile.includes(search)
  );

  if (filter !== "all") {
    filtered = filtered.filter((l) => l.status === filter);
  }

  // SORT
  const order = { new: 1, followup: 2, closed: 3 };
  filtered.sort((a, b) => order[a.status] - order[b.status]);

  return (
    <div className="appContainer">

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
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filtered.map((l) => (
        <div key={l.id} className="userCard">
          <div>
            <h4>{l.mobile}</h4>
            <p>{brands.find(b => b.id === l.brand_id)?.name}</p>
            <span className="roleTag">{l.status}</span>
          </div>

          <div className="actionBtns">
            <button onClick={() => handleEdit(l)}>Update</button>
          </div>
        </div>
      ))}

      {/* FAB */}
      <button className="fabBtn" onClick={() => {
        setEditId(null);
        setShow(true);
      }}>+</button>

      {/* MODAL */}
      {show && (
        <div className="modal">
          <div className="modalBox">

            <h3>{editId ? "Update Status" : "Add Lead"}</h3>

            <form onSubmit={handleSubmit}>

              {!editId && (
                <>
                  <input
                    placeholder="Mobile"
                    value={form.mobile}
                    onChange={(e)=>setForm({...form,mobile:e.target.value})}
                  />

                  <select
                    value={form.brand_id}
                    onChange={(e)=>setForm({...form,brand_id:e.target.value})}
                  >
                    <option value="">Brand</option>
                    {brands.map(b=>(
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>

                  <select
                    value={form.retailer_id}
                    onChange={(e)=>setForm({...form,retailer_id:e.target.value})}
                  >
                    <option value="">Retailer</option>
                    {retailers.map(r=>(
                      <option key={r.id} value={r.id}>
                        {r.business_name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* STATUS */}
              <select
                value={editId ? statusOnly : "new"}
                onChange={(e)=>setStatusOnly(e.target.value)}
              >
                <option value="new">New</option>
                <option value="followup">Followup</option>
                <option value="closed">Closed</option>
              </select>

              <button type="submit">
                {editId ? "Update" : "Create"}
              </button>

            </form>

            <button className="closeBtn" onClick={()=>{
              setShow(false);
              setEditId(null);
            }}>
              Close
            </button>

          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}