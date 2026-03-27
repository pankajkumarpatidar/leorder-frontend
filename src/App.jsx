import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import OrderCreate from "./pages/OrderCreate";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import PriceList from "./pages/PriceList";
import Profile from "./pages/Profile";

import AddProduct from "./pages/AddProduct";
import AddUser from "./pages/AddUser";
import AddRetailer from "./pages/AddRetailer";
import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import Worksheet from "./pages/Worksheet";
import AddWorksheet from "./pages/AddWorksheet";

import BottomNav from "./components/BottomNav";
import TopNav from "./components/TopNav";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : children;
};

const Layout = ({ children }) => {
  const location = useLocation();

  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideNav && <TopNav />}
      {children}
      {!hideNav && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><OrderCreate /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/price" element={<PrivateRoute><PriceList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
          <Route path="/add-lead" element={<PrivateRoute><AddLead /></PrivateRoute>} />

          <Route path="/worksheet" element={<PrivateRoute><Worksheet /></PrivateRoute>} />
          <Route path="/add-worksheet" element={<PrivateRoute><AddWorksheet /></PrivateRoute>} />

          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>} />
          <Route path="/add-retailer" element={<PrivateRoute><AddRetailer /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;