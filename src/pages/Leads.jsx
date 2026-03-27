import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Leads() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/lead/list");
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Error loading leads");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 STATUS UPDATE
  const updateStatus = async (id, status) => {
    await api.put("/api/lead/status", {
      lead_id: id,
      status
    });
    fetchData();
  };

  // 🔥 CONVERT
  const convertLead = async (id) => {
    const business_name = prompt("Business Name");

    if (!business_name) return;

    await api.post("/api/lead/convert", {
      lead_id: id,
      business_name
    });

    fetchData();
  };

  // 🎯 FILTER + SEARCH
  const filteredData = data.filter(l => {

    const matchStatus =
      filter === "all" || l.status === filter;

    const matchSearch =
      l.mobile?.includes(search);

    return matchStatus && matchSearch;
  });

  // 📊 ANALYTICS
  const total = data.length;
  const approved = data.filter(l=>l.status==="approved").length;
  const rejected = data.filter(l=>l.status==="rejected").length;
  const converted = data.filter(l=>l.status==="converted").length;

  return (
    <Layout>

      <h2>Leads</h2>

      {/* 📊 ANALYTICS */}
      <div className="grid">
        <div className="card">Total: {total}</div>
        <div className="card">Approved: {approved}</div>
        <div className="card">Rejected: {rejected}</div>
        <div className="card">Converted: {converted}</div>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      <div style={{ display:"flex", gap:10, margin:"15px 0" }}>

        <input
          placeholder="Search mobile..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="converted">Converted</option>
        </select>

      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading && filteredData.length === 0 && (
        <p>No leads found</p>
      )}

      {/* 📋 DESKTOP TABLE */}
      {!loading && filteredData.length > 0 && (
        <div className="card">

          <table>
            <thead>
              <tr>
                <th>Mobile</th>
                <th>Brand</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredData.map(l => (
                <tr key={l.id}>

                  <td>{l.mobile}</td>
                  <td>{l.brand_name || "-"}</td>

                  <td>
                    <span className={`badge ${l.status}`}>
                      {l.status}
                    </span>
                  </td>

                  <td>

                    {l.status === "new" && (
                      <>
                        <button onClick={()=>updateStatus(l.id,"approved")}>
                          ✔
                        </button>

                        <button onClick={()=>updateStatus(l.id,"rejected")}>
                          ✖
                        </button>
                      </>
                    )}

                    {l.status === "approved" && (
                      <button onClick={()=>convertLead(l.id)}>
                        Convert
                      </button>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>
          </table>

        </div>
      )}

      {/* 📱 MOBILE VIEW */}
      <div className="mobile-list">

        {filteredData.map(l => (
          <div key={l.id} className="card">

            <h3>{l.mobile}</h3>
            <p>{l.brand_name}</p>

            <span className={`badge ${l.status}`}>
              {l.status}
            </span>

            <div style={{marginTop:10}}>

              {l.status === "new" && (
                <>
                  <button onClick={()=>updateStatus(l.id,"approved")}>
                    Approve
                  </button>

                  <button onClick={()=>updateStatus(l.id,"rejected")}>
                    Reject
                  </button>
                </>
              )}

              {l.status === "approved" && (
                <button onClick={()=>convertLead(l.id)}>
                  Convert
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

    </Layout>
  );
}