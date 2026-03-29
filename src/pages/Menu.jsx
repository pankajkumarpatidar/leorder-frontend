import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();

  const Item = ({ label, path }) => (
    <div
      onClick={() => navigate(path)}
      className="userCard"
      style={{ cursor: "pointer" }}
    >
      <h4>{label}</h4>
    </div>
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Menu</h3>
      </div>

      {/* MENU ITEMS */}
      <Item label="Retailers" path="/retailers" />
      <Item label="Products" path="/products" />
      <Item label="Worksheet" path="/worksheet" />
      <Item label="Users" path="/users" /> {/* ✅ ADDED */}

      <Item label="About App" path="/about" />
      <Item label="Pricing Plans" path="/pricing" />
      <Item label="Privacy Policies" path="/privacy" />
      <Item label="Rules & Regulations" path="/rules" />
      <Item label="App Support" path="/support" />

    </div>
  );
}