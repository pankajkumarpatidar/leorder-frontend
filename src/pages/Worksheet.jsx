import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Worksheet() {

  const [data, setData] = useState([]);
  const [retailers, setRetailers] = useState([]);

  const [form, setForm] = useState({
    retailer_id: "",
    visit_type: "",
    notes: "",
    next_action: ""
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const w = await api.get("/api/worksheet/list");
    const r = await api.get("/api/retailer/list");

    setData(w.data.data);
    setRetailers(r.data.data);
  };

  // ➕ CREATE
  const createWorksheet = async () => {
    await api.post("/api/worksheet/create", form);

    setForm({
      retailer_id: "",
      visit_type: "",
      notes: "",
      next_action: ""
    });

    setShowForm(false);
    loadData();
  };

  // 🔁 STATUS UPDATE
  const updateStatus = async (id, status) => {
    await api.put("/api/worksheet/status", { id, status });
    loadData();
  };

  // 🔥 CONVERT TO LEAD
  const convertToLead = async (id) => {
    const brand_id = prompt("Enter Brand ID");

    if (!brand_id) return;

    await api.post("/api/worksheet/convert", {
      worksheet_id: id,
      brand_id
    });

    alert("Converted to Lead");
    loadData();
  };

  return (
    <Layout>
      <h2>Worksheet</h2>

      <button onClick={() => setShowForm(true)}>
        + Add Visit
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card">

          <h3>New Visit</h3>

          <select
            value={form.retailer_id}
            onChange={(e)=>
              setForm({...form, retailer_id: e.target.value})
            }
          >
            <option>Select Retailer</option>
            {retailers.map(r=>(
              <option key={r.id} value={r.id}>
                {r.business_name}
              </option>
            ))}
          </select>

          <input
            placeholder="Visit Type (cold/hot/followup)"
            value={form.visit_type}
            onChange={(e)=>
              setForm({...form, visit_type: e.target.value})
            }
          />

          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e)=>
              setForm({...form, notes: e.target.value})
            }
          />

          <input
            placeholder="Next Action"
            value={form.next_action}
            onChange={(e)=>
              setForm({...form, next_action: e.target.value})
            }
          />

          <button onClick={createWorksheet}>Save</button>

        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="card">

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Retailer</th>
              <th>Visit</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map(w=>(
              <tr key={w.id}>

                <td>{w.user_name}</td>
                <td>{w.retailer_name || "-"}</td>
                <td>{w.visit_type}</td>
                <td>{w.status}</td>

                <td>

                  <button onClick={()=>updateStatus(w.id,"done")}>
                    Done
                  </button>

                  <button onClick={()=>convertToLead(w.id)}>
                    Lead
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </Layout>
  );
}