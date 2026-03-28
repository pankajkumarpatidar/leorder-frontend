import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Products() {
  const token = localStorage.getItem("token");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCount(data.data?.length || 0);
      } catch (err) {
        console.log("Products error", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="header">
        <h3>Products</h3>
        <p>Total: {count}</p>
      </div>

      <div className="highlightCard">
        <p>Manage products</p>
        <h2>{count}</h2>
      </div>

      <Fab onClick={() => alert("Add Product")} />
    </div>
  );
}