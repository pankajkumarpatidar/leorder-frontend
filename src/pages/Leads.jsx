import Fab from "../components/Fab";

export default function Leads() {
  return (
    <div>
      <div className="header">
        <h3>Leads</h3>
        <p>Total: 0</p>
      </div>

      <div className="highlightCard">
        <p>Manage your leads</p>
        <h2>0</h2>
      </div>

      {/* FAB */}
      <Fab onClick={() => alert("Add Lead")} />
    </div>
  );
}