import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// 🔓 Public Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// 🔒 Protected Pages
import Dashboard from "./pages/Dashboard";
import OrderCreate from "./pages/OrderCreate";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import PriceList from "./pages/PriceList";
import Profile from "./pages/Profile";

// 🔥 NEW CORE PAGES
import Leads from "./pages/Leads";
import Worksheet from "./pages/Worksheet";

// 🔥 Admin / Actions
import AddProduct from "./pages/AddProduct";
import AddUser from "./pages/AddUser";
import AddRetailer from "./pages/AddRetailer";
import AddWorksheet from "./pages/AddWorksheet"; // 🔥 NEW

// 🔥 UI
import BottomNav from "./components/BottomNav";
import TopNav from "./components/TopNav";

// 🔒 PRIVATE ROUTE
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};


// 🔓 PUBLIC ROUTE
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : children;
};


// 🔥 LAYOUT (NAV CONTROL)
const Layout = ({ children }) => {
  const location = useLocation();

  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideNav && <TopNav />}   {/* 🔥 ADD THIS */}

      {children}

      {!hideNav && <BottomNav />}
    </>
  );
};


// 🚀 MAIN APP
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* 🔓 PUBLIC */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 🔒 MAIN FLOW */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><OrderCreate /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />

          <Route path="/price" element={<PrivateRoute><PriceList /></PrivateRoute>} />

          {/* 🔥 NEW FLOW */}
          <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
          <Route path="/worksheet" element={<PrivateRoute><Worksheet /></PrivateRoute>} />

          {/* 🔥 PROFILE */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* 🔥 ACTION PAGES */}
          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>} />
          <Route path="/add-retailer" element={<PrivateRoute><AddRetailer /></PrivateRoute>} />
          <Route path="/add-worksheet" element={<PrivateRoute><AddWorksheet /></PrivateRoute>} />

          {/* 🔁 FALLBACK */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;