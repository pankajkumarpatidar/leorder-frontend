import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "User";

  const [filter, setFilter] = useState("month");

  const [stats, setStats] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          ordersRes,
          productsRes,
          retailersRes
        ] = await Promise.all([
          fetch(`${BASE_URL}/orders`, { headers }),
          fetch(`${BASE_URL}/products`, { headers }),
          fetch(`${BASE_URL}/retailers`, { headers }),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        const retailersData = await retailersRes.json();

        const orders = ordersData.data || ordersData || [];
        const products = productsData.data || productsData || [];
        const retailers = retailersData.data || retailersData || [];

        const now = new Date();

        const currentMonthOrders = [];
        const lastMonthOrders = [];

        orders.forEach((o) => {
          const d = new Date(o.created_at);

          if (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          ) {
            currentMonthOrders.push(o);
          }

          if (
            d.getMonth() === now.getMonth() - 1 &&
            d.getFullYear() === now.getFullYear()
          ) {
            lastMonthOrders.push(o);
          }
        });

        // 🔥 MAPS
        const productMap = {};
        products.forEach((p) => {
          productMap[p.id] = {
            name: p.name,
            category: p.category,
          };
        });

        const retailerMap = {};
        retailers.forEach((r) => {
          retailerMap[r.id] = r.name;
        });

        // 🔥 CATEGORY STATS
        const categoryStats = {};
        const productStats = {};
        const retailerStats = {};

        let totalQty = 0;
        let totalRevenue = 0;

        for (const o of currentMonthOrders) {
          totalRevenue += Number(o.total || 0);

          if (!o.items) continue;

          o.items.forEach((i) => {
            const p = productMap[i.product_id];
            if (!p) return;

            const cat = p.category || "Other";

            // CATEGORY
            if (!categoryStats[cat]) {
              categoryStats[cat] = { qty: 0, total: 0 };
            }

            categoryStats[cat].qty += Number(i.qty || 0);
            categoryStats[cat].total += Number(i.total || 0);

            // PRODUCT
            if (!productStats[p.name]) {
              productStats[p.name] = 0;
            }

            productStats[p.name] += Number(i.qty || 0);

            totalQty += Number(i.qty || 0);
          });

          // RETAILER
          const rName = retailerMap[o.retailer_id] || "Unknown";

          if (!retailerStats[rName]) {
            retailerStats[rName] = 0;
          }

          retailerStats[rName] += Number(o.total || 0);
        }

        // 🔥 LAST MONTH REVENUE
        const lastRevenue = lastMonthOrders.reduce(
          (sum, o) => sum + Number(o.total || 0),
          0
        );

        const growth =
          lastRevenue > 0
            ? Math.round(((totalRevenue - lastRevenue) / lastRevenue) * 100)
            : 100;

        // 🔥 TOPS
        const topCategory = Object.entries(categoryStats).sort(
          (a, b) => b[1].total - a[1].total
        )[0];

        const topProduct = Object.entries(productStats).sort(
          (a, b) => b[1] - a[1]
        )[0];

        const topRetailer = Object.entries(retailerStats).sort(
          (a, b) => b[1] - a[1]
        )[0];

        setInsights({
          totalRevenue,
          totalQty,
          growth,
          topCategory: topCategory?.[0],
          topProduct: topProduct?.[0],
          topRetailer: topRetailer?.[0],
        });

        setCategoryData(
          Object.keys(categoryStats).map((c) => ({
            name: c,
            qty: categoryStats[c].qty,
            total: categoryStats[c].total,
          }))
        );

        setStats({
          orders: currentMonthOrders.length,
          retailers: retailers.length,
          qty: totalQty,
        });

      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchData();
  }, [token]);

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Hello, {name} 👋</h3>
      </div>

      {/* 🔥 INSIGHTS */}
      <div className="cards">
        <div className="cardItem green">
          <p>Total Revenue</p>
          <h3>₹ {insights.totalRevenue || 0}</h3>
        </div>

        <div className="cardItem blue">
          <p>Total Qty</p>
          <h3>{insights.totalQty || 0}</h3>
        </div>

        <div className="cardItem purple">
          <p>Growth</p>
          <h3>{insights.growth || 0}%</h3>
        </div>
      </div>

      {/* 🔥 TOP PERFORMANCE */}
      <div style={{ marginTop: 20 }}>
        <h3>🏆 Top Performance</h3>

        <div className="userCard">
          <p>Top Category</p>
          <h4>{insights.topCategory}</h4>
        </div>

        <div className="userCard">
          <p>Top Product</p>
          <h4>{insights.topProduct}</h4>
        </div>

        <div className="userCard">
          <p>Top Retailer</p>
          <h4>{insights.topRetailer}</h4>
        </div>
      </div>

      {/* 🔥 CATEGORY */}
      <div style={{ marginTop: 20 }}>
        <h3>📊 Category Report</h3>

        {categoryData.map((c, i) => (
          <div key={i} className="userCard">
            <h4>{c.name}</h4>
            <p>₹ {c.total}</p>
            <small>Qty: {c.qty}</small>
          </div>
        ))}
      </div>

    </div>
  );
}