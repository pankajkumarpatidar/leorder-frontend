import { useEffect, useState } from "react";
import BASE_URL from "../api";
import BottomNav from "../components/BottomNav";

export default function Worksheet() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/worksheets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => setData(res.data || []));
  }, []);

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Worksheet</h3>
        <p>{data.length}</p>
      </div>

      {data.map(w => (
        <div key={w.id} className="userCard">

          <div>
            <h4>{w.mobile}</h4>
            <p>{w.notes}</p>
          </div>

          <span className="roleTag">Visit</span>

        </div>
      ))}

      <button className="fabBtn">+</button>

      <BottomNav />
    </div>
  );
}
