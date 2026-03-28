export default function Dashboard() {
  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <div>
          <h3>Hello, Pankaj 👋</h3>
          <p>Check your business report</p>
        </div>

        <div className="avatar">P</div>
      </div>

      {/* MAIN CARD */}
      <div className="highlightCard">
        <p>Total Sales</p>
        <h2>₹2.4L</h2>
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
          <h3>32</h3>
        </div>

        <div className="cardItem blue">
          <p>Users</p>
          <h3>8</h3>
        </div>

      </div>

    </div>
  );
}