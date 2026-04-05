import { useEffect, useState } from "react";
import BASE_URL from "../api";
import BottomNav from "../components/BottomNav";

export default function Leads() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/leads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => setData(res.data || []));
  }, []);

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Leads</h3>
        <p>{data.length}</p>
      </div>

      <input
        className="searchBox"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {data
        .filter(l =>
          l.business_name?.toLowerCase().includes(search.toLowerCase())
        )
        .map(l => (
          <div key={l.id} className="userCard">
            <div>
              <h4>{l.business_name}</h4>
              <p>{l.mobile}</p>
            </div>

            <span className="roleTag">{l.status}</span>
          </div>
        ))}

      <button className="fabBtn">+</button>

      <BottomNav />
    </div>
  );
}
