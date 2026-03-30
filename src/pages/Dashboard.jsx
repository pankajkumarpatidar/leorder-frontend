import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "User";

  const [stats, setStats] = useState({
    leads: 0,
    orders: 0,
    retailers: 0,
    products: 0,
  });

  const [totalBusiness, setTotalBusiness] = useState(0);
  const [brandRevenue, setBrandRevenue] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          leadsRes,
          ordersRes,
          retailersRes,
          productsRes,
          brandsRes,
        ] = await Promise.all([
          fetch(`${BASE_URL}/leads`, { headers }),
          fetch(`${BASE_URL}/orders`, { headers }),
          fetch(`${BASE_URL}/retailers`, { headers }),
          fetch(`${BASE_URL}/products`, { headers }),
          fetch(`${BASE_URL}/brands`, { headers }),
        ]);

        const leadsData = await leadsRes.json();
        const ordersData = await ordersRes.json();
        const retailersData = await retailersRes.json();
        const productsData = await productsRes.json();
        const brandsData = await brandsRes.json();

        const leads = leadsData.data || leadsData || [];
        const orderList = ordersData.data || ordersData || [];
        const retailers = retailersData.data || retailersData || [];
        const productList = productsData.data || productsData || [];
        const brandList = brandsData.data || brandsData || [];

        // 🔥 TOTAL BUSINESS
        const total = orderList.reduce(
          (sum, o) => sum + Number(o.total || 0),
          0
        );

        setTotalBusiness(total);

        // 🔥 BRAND ANALYTICS
        const brandMap = {};
        productList.forEach((p) => {
          brandMap[p.id] = p.brand_id;
        });

        const brandStats = {};

        let totalQty = 0;

        for (const o of orderList) {
          if (!o.items) continue;

          o.items.forEach((i) => {
            const brandId = brandMap[i.product_id];
            if (!brandId) return;

            if (!brandStats[brandId]) {
              brandStats[brandId] = {
                revenue: 0,
                qty: 0,
              };
            }

            brandStats[brandId].revenue += Number(i.total || 0);
            brandStats[brandId].qty += Number(i.qty || 0);

            totalQty += Number(i.qty || 0);
          });
        }

        const finalBrandRevenue = brandList.map((b) => ({
          id: b.id,
          name: b.name,
          total: brandStats[b.id]?.revenue || 0,
          qty: brandStats[b.id]?.qty || 0,
        }));

        // 🔥 TOP BRAND
        const topBrand =
          finalBrandRevenue.sort((a, b) => b.total - a.total)[0] || null;

        // 🔥 AVERAGE ORDER VALUE
        const avgOrder =
          orderList.length > 0
            ? Math.round(total / orderList.length)
            : 0;

        setInsights({
          topBrand,
          avgOrder,
          totalQty,
        });

        setBrandRevenue(finalBrandRevenue);

        setStats({
          leads: leads.length,
          orders: orderList.length,
          retailers: retailers.length,
          products: productList.length,
        });

      } catch (err) {
        console.log("Dashboard error", err);
      }
    };

    if (token) fetchData();
  }, [token]);

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <div>
          <h3>Hello, {name} 👋</h3>
          <p>Welcome back</p>
        </div>

        <div
          className="avatar"
          onClick={() => navigate("/profile")}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* TOTAL BUSINESS */}
      <div className="highlightCard">
        <p>Total Business</p>
        <h2>₹ {totalBusiness.toLocaleString()}</h2>
        <span>Live revenue</span>
      </div>

      {/* STATS */}
      <div className="cards">

        <div className="cardItem purple" onClick={() => navigate("/leads")}>
          <p>Leads</p>
          <h3>{stats.leads}</h3>
        </div>

        <div className="cardItem green" onClick={() => navigate("/orders")}>
          <p>Orders</p>
          <h3>{stats.orders}</h3>
        </div>

        <div className="cardItem yellow" onClick={() => navigate("/retailers")}>
          <p>Retailers</p>
          <h3>{stats.retailers}</h3>
        </div>

        <div className="cardItem blue" onClick={() => navigate("/products")}>
          <p>Products</p>
          <h3>{stats.products}</h3>
        </div>

      </div>

      {/* 🔥 SMART INSIGHTS */}
      <div style={{ marginTop: 20 }}>
        <h3>📊 Smart Insights</h3>

        <div className="userCard">
          <p>Top Brand</p>
          <h4>{insights.topBrand?.name || "N/A"}</h4>
        </div>

        <div className="userCard">
          <p>Avg Order Value</p>
          <h4>₹ {insights.avgOrder || 0}</h4>
        </div>

        <div className="userCard">
          <p>Total Items Sold</p>
          <h4>{insights.totalQty || 0}</h4>
        </div>
      </div>

      {/* 🔥 BRAND DATA */}
      <div style={{ marginTop: 20 }}>
        <h3>🏷 Brand Performance</h3>

        {brandRevenue.map((b) => (
          <div
            key={b.id}
            className="userCard"
            onClick={() =>
              alert(
                `${b.name}\nRevenue: ₹${b.total}\nQty Sold: ${b.qty}`
              )
            }
          >
            <h4>{b.name}</h4>
            <p>₹ {b.total}</p>
            <small>Qty: {b.qty}</small>
          </div>
        ))}
      </div>

    </div>
  );
}