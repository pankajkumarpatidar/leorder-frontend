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

  const [totalBusiness, setTotalBusiness] = useState(0); // 🔥 NEW
  const [brandRevenue, setBrandRevenue] = useState([]); // 🔥 NEW

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
          brandsRes
        ] = await Promise.all([
          fetch(`${BASE_URL}/leads`, { headers }),
          fetch(`${BASE_URL}/orders`, { headers }),
          fetch(`${BASE_URL}/retailers`, { headers }),
          fetch(`${BASE_URL}/products`, { headers }),
          fetch(`${BASE_URL}/brands`, { headers }),
        ]);

        const leads = await leadsRes.json();
        const orders = await ordersRes.json();
        const retailers = await retailersRes.json();
        const products = await productsRes.json();
        const brands = await brandsRes.json();

        const orderList = orders.data || [];
        const productList = products.data || [];
        const brandList = brands.data || [];

        // 🔥 TOTAL BUSINESS (REAL)
        const total = orderList.reduce(
          (sum, o) => sum + Number(o.total || 0),
          0
        );

        setTotalBusiness(total);

        // 🔥 BRAND REVENUE CALC
        const brandMap = {};
        productList.forEach((p) => {
          brandMap[p.id] = p.brand_id;
        });

        const revenue = {};

        for (const o of orderList) {
          if (!o.items) continue;

          o.items.forEach((i) => {
            const brandId = brandMap[i.product_id];
            if (!brandId) return;

            revenue[brandId] =
              (revenue[brandId] || 0) + Number(i.total || 0);
          });
        }

        const finalBrandRevenue = brandList.map((b) => ({
          id: b.id,
          name: b.name,
          total: revenue[b.id] || 0,
        }));

        setBrandRevenue(finalBrandRevenue);

        setStats({
          leads: leads.data?.length || 0,
          orders: orderList.length || 0,
          retailers: retailers.data?.length || 0,
          products: productList.length || 0,
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

      {/* MAIN CARD */}
      <div className="highlightCard">
        <p>Total Business</p>
        <h2>₹ {totalBusiness.toLocaleString()}</h2>
        <span>Live revenue</span>
      </div>

      {/* SMALL CARDS */}
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

      {/* 🔥 BRAND SMART DATA */}
      <div style={{ marginTop: 20 }}>
        {brandRevenue.map((b) => (
          <div
            key={b.id}
            className="userCard"
            onClick={() =>
              alert(`${b.name} revenue this month: ₹${b.total}`)
            }
          >
            <h4>{b.name}</h4>
            <p>₹ {b.total}</p>
          </div>
        ))}
      </div>

    </div>
  );
}