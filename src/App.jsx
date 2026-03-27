import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Retailers from "./pages/Retailers";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Worksheet from "./pages/Worksheet";
import Users from "./pages/Users";

// 🔐 AUTH CHECK
const Private = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
};

// 🔥 LAYOUT WRAPPER
const WithLayout = (Component) => (
  <Layout>
    <Component />
  </Layout>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PRIVATE + LAYOUT */}
        <Route path="/" element={<Private>{WithLayout(Dashboard)}</Private>} />
        <Route path="/leads" element={<Private>{WithLayout(Leads)}</Private>} />
        <Route path="/retailers" element={<Private>{WithLayout(Retailers)}</Private>} />
        <Route path="/orders" element={<Private>{WithLayout(Orders)}</Private>} />
        <Route path="/products" element={<Private>{WithLayout(Products)}</Private>} />
        <Route path="/worksheet" element={<Private>{WithLayout(Worksheet)}</Private>} />
        <Route path="/users" element={<Private>{WithLayout(Users)}</Private>} />

      </Routes>
    </BrowserRouter>
  );
}