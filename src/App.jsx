// ===== FILE: App.jsx =====

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ===== PAGES =====
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";
import OrderDetails from "./pages/OrderDetails";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";

import Retailers from "./pages/Retailers";
import RetailerDetails from "./pages/RetailerDetails";

import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import LeadDetails from "./pages/LeadDetails";

import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import UserDetails from "./pages/UserDetails";

import Worksheet from "./pages/Worksheet";
import AddWorksheet from "./pages/AddWorksheet";

import Profile from "./pages/Profile";
import Menu from "./pages/Menu";

// ✅ FIXED (Privacy.jsx)
import PrivacyPolicy from "./pages/Privacy";

import Support from "./pages/Support";

// ===== PROTECTED ROUTE =====
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// ===== ROLE BASED ROUTE =====
const RoleRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default function App() {
  return (
    <Router>

      <Routes>

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== HOME ===== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* ===== ORDERS ===== */}
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/add-order" element={<ProtectedRoute><AddOrder /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

        {/* ===== PRODUCTS ===== */}
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

        {/* ===== RETAILERS ===== */}
        <Route path="/retailers" element={<ProtectedRoute><Retailers /></ProtectedRoute>} />
        <Route path="/retailers/:id" element={<ProtectedRoute><RetailerDetails /></ProtectedRoute>} />

        {/* ===== LEADS ===== */}
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/add-lead" element={<ProtectedRoute><AddLead /></ProtectedRoute>} />
        <Route path="/leads/:id" element={<ProtectedRoute><LeadDetails /></ProtectedRoute>} />

        {/* ===== USERS (ADMIN / STAFF ONLY) ===== */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "staff"]}>
                <Users />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "staff"]}>
                <AddUser />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "staff"]}>
                <UserDetails />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ===== WORKSHEET ===== */}
        <Route path="/worksheet" element={<ProtectedRoute><Worksheet /></ProtectedRoute>} />
        <Route path="/add-worksheet" element={<ProtectedRoute><AddWorksheet /></ProtectedRoute>} />

        {/* ===== PROFILE ===== */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* ===== MENU ===== */}
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />

        {/* ===== EXTRA ===== */}
        <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>
  );
}
