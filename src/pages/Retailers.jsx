import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Retailers() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    business_name: "",
    mobile: ""
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/api/retailer/list");
    setData(res.data.data);
  };

  const createRetailer = async () => {
    await api.post("/api/retailer/create", form);

    setForm({ business_name: "", mobile: "" });
    setShowForm(false);

    fetchData();
  };

  const deleteRetailer = async (id) => {
    await api.delete(`/api/retailer/delete/${id}`);
    fetchData();
  };

  return (
    <Layout>
      <h2>Retailers</h2>

      {/* ADD BUTTON */}
      <button onClick={() => setShowForm(true)}>+ Add Retailer</button>

      {/* FORM */}
      {showForm && (
        <div className="card">
          <h3>New Retailer</h3>

          <input
            placeholder="Business Name"
            value={form.business_name}
            onChange={(e) =>
              setForm({ ...form, business_name: e.target.value })
            }
          />

          <input
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />

          <button onClick={createRetailer}>Save</button>
        </div>
      )}

      {/* TABLE */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r) => (
              <tr key={r.id}>
                <td>{r.business_name}</td>
                <td>{r.mobile}</td>

                <td>
                  <button onClick={() => deleteRetailer(r.id)}>
                    Delete
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