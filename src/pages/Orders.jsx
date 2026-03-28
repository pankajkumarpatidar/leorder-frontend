import Fab from "../components/Fab";

export default function Orders() {
  return (
    <div>
      <div className="header">
        <h3>Orders</h3>
        <p>Total: 0</p>
      </div>

      <div className="highlightCard">
        <p>Manage your orders</p>
        <h2>0</h2>
      </div>

      <Fab onClick={() => alert("Create Order")} />
    </div>
  );
}