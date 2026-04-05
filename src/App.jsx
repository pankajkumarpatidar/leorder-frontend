// ===== FILE: src/App.jsx =====

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ===== AUTH =====
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ===== MAIN =====
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Profile from "./pages/Profile";

// ===== USERS =====
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import UserDetails from "./pages/UserDetails";

// ===== LEADS =====
import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import LeadDetails from "./pages/LeadDetails";

// ===== RETAILERS =====
import Retailers from "./pages/Retailers";
import RetailerDetails from "./pages/RetailerDetails";

// ===== PRODUCTS =====
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";

// ===== ORDERS =====
import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";
import OrderDetails from "./pages/OrderDetails";

// ===== WORKSHEET =====
import Worksheet from "./pages/Worksheet";
import AddWorksheet from "./pages/AddWorksheet";

// ===== EXTRA =====
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Support from "./pages/Support";

// ===== AUTH CHECK =====
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// ===== ROLE CHECK =====
const RoleRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!roles.includes(user.role)) {
    return <Navigate to="/home" />;
  }

  return children;
};

// ===== APP =====
export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== DEFAULT ===== */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* ===== HOME ===== */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        {/* ===== MENU ===== */}
        <Route path="/menu" element={
          <PrivateRoute>
            <Menu />
          </PrivateRoute>
        } />

        {/* ===== PROFILE ===== */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* ===== USERS ===== */}
        <Route path="/users" element={
          <PrivateRoute>
            <RoleRoute roles={["admin", "staff"]}>
              <Users />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/add-user" element={
          <PrivateRoute>
            <RoleRoute roles={["admin", "staff"]}>
              <AddUser />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/users/:id" element={
          <PrivateRoute>
            <UserDetails />
          </PrivateRoute>
        } />

        {/* ===== LEADS ===== */}
        <Route path="/leads" element={
          <PrivateRoute>
            <Leads />
          </PrivateRoute>
        } />

        <Route path="/add-lead" element={
          <PrivateRoute>
            <Leads />
          </PrivateRoute>
        } />

        <Route path="/leads/:id" element={
          <PrivateRoute>
            <LeadDetails />
          </PrivateRoute>
        } />

        {/* ===== RETAILERS ===== */}
        <Route path="/retailers" element={
          <PrivateRoute>
            <Retailers />
          </PrivateRoute>
        } />

        <Route path="/retailers/:id" element={
          <PrivateRoute>
            <RetailerDetails />
          </PrivateRoute>
        } />

        {/* ===== PRODUCTS ===== */}
        <Route path="/products" element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        } />

        <Route path="/add-product" element={
          <PrivateRoute>
            <RoleRoute roles={["admin", "staff"]}>
              <AddProduct />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/products/:id" element={
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        } />

        {/* ===== ORDERS ===== */}
        <Route path="/orders" element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        } />

        <Route path="/add-order" element={
          <PrivateRoute>
            <AddOrder />
          </PrivateRoute>
        } />

        <Route path="/orders/:id" element={
          <PrivateRoute>
            <OrderDetails />
          </PrivateRoute>
        } />

        {/* ===== WORKSHEET ===== */}
        <Route path="/worksheet" element={
          <PrivateRoute>
            <Worksheet />
          </PrivateRoute>
        } />

        <Route path="/add-worksheet" element={
          <PrivateRoute>
            <AddWorksheet />
          </PrivateRoute>
        } />

        {/* ===== EXTRA ===== */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/support" element={<Support />} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/home" />} />

      </Routes>

    </BrowserRouter>
  );
}
