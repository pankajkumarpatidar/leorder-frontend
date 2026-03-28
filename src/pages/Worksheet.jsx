import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Worksheet() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const fetchWorksheet = async () => {
      try {
        const res = await fetch(`${BASE_URL}/worksheets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        const rows = result.data || [];

        setData(rows);

        // 🔥 TODAY FILTER
        const today = new Date().toISOString().split("T")[0];

        const todayData = rows.filter((r) =>
          r.created_at?.startsWith(today)
        );

        setTodayCount(todayData.length);

        // 🔥 STATUS COUNT
        setPending(rows.filter((r) => r.status === "pending").length);
        setCompleted(rows.filter((r) => r.status === "completed").length);

      } catch (err) {
        console.log("Worksheet error", err);
      }
    };

    fetchWorksheet();
  }, []);

  return (
    <div>
      <div className="header">
        <h3>Worksheet</h3>
        <p>Daily work tracking</p>
      </div>

      <div className="highlightCard">
        <p>Today Visits</p>
        <h2>{todayCount}</h2>
      </div>

      <div className="cards">
        <div className="cardItem purple">
          <p>Pending</p>
          <h3>{pending}</h3>
        </div>
        <div className="cardItem green">
          <p>Completed</p>
          <h3>{completed}</h3>
        </div>
      </div>

      <Fab onClick={() => alert("Add Worksheet Entry")} />
    </div>
  );
}