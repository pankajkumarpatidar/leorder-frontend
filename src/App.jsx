import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// PAGES
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";   // ✅ NEW
import Products from "./pages/Products";
import Users from "./pages/Users";
import Worksheet from "./pages/Worksheet";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Retailers from "./pages/Retailers";

// LAYOUT
import Layout from "./components/Layout";

// 🔒 PRIVATE ROUTE
const Private = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== MAIN APP ===== */}

        <Route path="/" element={
          <Private>
            <Layout><Dashboard /></Layout>
          </Private>
        } />

        <Route path="/leads" element={
          <Private>
            <Layout><Leads /></Layout>
          </Private>
        } />

        <Route path="/retailers" element={
          <Private>
            <Layout><Retailers /></Layout>
          </Private>
        } />

        <Route path="/orders" element={
          <Private>
            <Layout><Orders /></Layout>
          </Private>
        } />

        {/* 🔥 ADD ORDER ROUTE */}
        <Route path="/add-order" element={
          <Private>
            <Layout><AddOrder /></Layout>
          </Private>
        } />

        <Route path="/products" element={
          <Private>
            <Layout><Products /></Layout>
          </Private>
        } />

        <Route path="/users" element={
          <Private>
            <Layout><Users /></Layout>
          </Private>
        } />

        <Route path="/worksheet" element={
          <Private>
            <Layout><Worksheet /></Layout>
          </Private>
        } />

        <Route path="/profile" element={
          <Private>
            <Layout><Profile /></Layout>
          </Private>
        } />

        <Route path="/menu" element={
          <Private>
            <Layout><Menu /></Layout>
          </Private>
        } />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}