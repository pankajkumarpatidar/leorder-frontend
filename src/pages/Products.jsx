import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Products() {

  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    pcs_per_box: "",
    dp_per_pcs: "",
    mrp_per_pcs: ""
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await api.get("/api/product/list");
    const b = await api.get("/api/brand/list");

    setData(p.data.data);
    setBrands(b.data.data);
  };

  // ➕ CREATE
  const createProduct = async () => {
    await api.post("/api/product/create", form);

    setForm({
      name: "",
      brand_id: "",
      pcs_per_box: "",
      dp_per_pcs: "",
      mrp_per_pcs: ""
    });

    setShowForm(false);
    loadData();
  };

  // ✏️ UPDATE PRICE
  const updatePrice = async (p) => {
    await api.put("/api/product/update", {
      id: p.id,
      dp_per_pcs: p.dp_per_pcs,
      mrp_per_pcs: p.mrp_per_pcs,
      unit: p.unit
    });

    alert("Updated");
  };

  return (
    <Layout>
      <h2>Products</h2>

      <button onClick={() => setShowForm(true)}>
        + Add Product
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card">
          <h3>New Product</h3>

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <select
            value={form.brand_id}
            onChange={(e)=>setForm({...form,brand_id:e.target.value})}
          >
            <option>Select Brand</option>
            {brands.map(b=>(
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            placeholder="PCS per box"
            onChange={(e)=>setForm({...form,pcs_per_box:e.target.value})}
          />

          <input
            placeholder="DP price"
            onChange={(e)=>setForm({...form,dp_per_pcs:e.target.value})}
          />

          <input
            placeholder="MRP price"
            onChange={(e)=>setForm({...form,mrp_per_pcs:e.target.value})}
          />

          <button onClick={createProduct}>Save</button>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>DP</th>
              <th>MRP</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map(p=>(
              <tr key={p.id}>

                <td>{p.name}</td>
                <td>{p.brand_name}</td>

                <td>
                  <input
                    value={p.dp_per_pcs}
                    onChange={(e)=>{
                      p.dp_per_pcs = e.target.value;
                      setData([...data]);
                    }}
                  />
                </td>

                <td>
                  <input
                    value={p.mrp_per_pcs}
                    onChange={(e)=>{
                      p.mrp_per_pcs = e.target.value;
                      setData([...data]);
                    }}
                  />
                </td>

                <td>
                  <button onClick={()=>updatePrice(p)}>
                    Update
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