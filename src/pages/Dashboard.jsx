export default function Dashboard() {
  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <div>
          <h3>Hello, Pankaj 👋</h3>
          <p>Welcome back</p>
        </div>

        <div className="avatar">P</div>
      </div>

      {/* MAIN CARD */}
      <div className="highlightCard">
        <p>Total Business</p>
        <h2>₹ 1,25,000</h2>
        <span>+12% this month</span>
      </div>

      {/* SMALL CARDS */}
      <div className="cards">

        <div className="cardItem purple">
          <p>Leads</p>
          <h3>120</h3>
        </div>

        <div className="cardItem green">
          <p>Orders</p>
          <h3>45</h3>
        </div>

        <div className="cardItem yellow">
          <p>Retailers</p>
          <h3>30</h3>
        </div>

        <div className="cardItem blue">
          <p>Products</p>
          <h3>80</h3>
        </div>

      </div>

    </div>
  );
}