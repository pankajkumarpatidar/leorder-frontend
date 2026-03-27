import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Retailers from "./pages/Retailers";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Worksheet from "./pages/Worksheet";
import Users from "./pages/Users";

const Private = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Private><Dashboard /></Private>} />
        <Route path="/leads" element={<Private><Leads /></Private>} />
        <Route path="/retailers" element={<Private><Retailers /></Private>} />
        <Route path="/orders" element={<Private><Orders /></Private>} />
        <Route path="/products" element={<Private><Products /></Private>} />
        <Route path="/worksheet" element={<Private><Worksheet /></Private>} />
        <Route path="/users" element={<Private><Users /></Private>} />

      </Routes>
    </BrowserRouter>
  );
}