import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Users from "./pages/Users";

import Layout from "./components/Layout";

const Private = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* APP WITH LAYOUT */}
        <Route path="/" element={
          <Private>
            <Layout>
              <Dashboard />
            </Layout>
          </Private>
        } />

        <Route path="/leads" element={
          <Private>
            <Layout>
              <Leads />
            </Layout>
          </Private>
        } />

        <Route path="/orders" element={
          <Private>
            <Layout>
              <Orders />
            </Layout>
          </Private>
        } />

        <Route path="/products" element={
          <Private>
            <Layout>
              <Products />
            </Layout>
          </Private>
        } />

        <Route path="/users" element={
          <Private>
            <Layout>
              <Users />
            </Layout>
          </Private>
        } />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}