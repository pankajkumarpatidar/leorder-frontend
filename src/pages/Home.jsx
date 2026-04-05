import BottomNav from "../components/BottomNav";

export default function Home() {
  return (
    <div className="appContainer">

      <div className="header">
        <h3>Dashboard</h3>
        <div className="avatar">OP</div>
      </div>

      <div className="highlightCard">
        <p>Total Revenue</p>
        <h2>₹ 0</h2>
      </div>

      <div className="cards">
        <div className="cardItem">
          <p>Total Orders</p>
          <h3>0</h3>
        </div>

        <div className="cardItem">
          <p>Total Qty</p>
          <h3>0</h3>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
