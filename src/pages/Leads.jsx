import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Leads() {
  const token = localStorage.getItem("token");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${BASE_URL}/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCount(data.data?.length || 0);
      } catch (err) {
        console.log("Leads error", err);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div>
      <div className="header">
        <h3>Leads</h3>
        <p>Total: {count}</p>
      </div>

      <div className="highlightCard">
        <p>Manage your leads</p>
        <h2>{count}</h2>
      </div>

      {/* FAB */}
      <Fab onClick={() => alert("Add Lead")} />
    </div>
  );
}