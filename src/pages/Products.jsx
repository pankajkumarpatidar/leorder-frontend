import Fab from "../components/Fab";

export default function Products() {
  return (
    <div>
      <div className="header">
        <h3>Products</h3>
        <p>Total: 0</p>
      </div>

      <div className="highlightCard">
        <p>Manage products</p>
        <h2>0</h2>
      </div>

      <Fab onClick={() => alert("Add Product")} />
    </div>
  );
}