import Fab from "../components/Fab";

export default function Worksheet() {
  return (
    <div>
      <div className="header">
        <h3>Worksheet</h3>
        <p>Daily work tracking</p>
      </div>

      <div className="highlightCard">
        <p>Today Visits</p>
        <h2>0</h2>
      </div>

      <div className="cards">
        <div className="cardItem purple">
          <p>Pending</p>
          <h3>0</h3>
        </div>
        <div className="cardItem green">
          <p>Completed</p>
          <h3>0</h3>
        </div>
      </div>

      <Fab onClick={() => alert("Add Worksheet Entry")} />
    </div>
  );
}