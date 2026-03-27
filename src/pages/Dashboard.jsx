import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>

      <h2>Dashboard</h2>

      <div className="grid">

        <div className="card">
          <h4>Total Leads</h4>
          <h1>120</h1>
        </div>

        <div className="card">
          <h4>Orders</h4>
          <h1>45</h1>
        </div>

        <div className="card">
          <h4>Retailers</h4>
          <h1>32</h1>
        </div>

        <div className="card">
          <h4>Sales</h4>
          <h1>₹2.4L</h1>
        </div>

      </div>

    </Layout>
  );
}