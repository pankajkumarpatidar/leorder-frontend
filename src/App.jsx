import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import OrderCreate from "./pages/OrderCreate";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import PriceList from "./pages/PriceList";
import Profile from "./pages/Profile"; // ✅ NEW

import BottomNav from "./components/BottomNav";


// 🔒 Private Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};


// 🔓 Public Route
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : children;
};


// 🔥 Layout
const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {children}

      {location.pathname !== "/login" &&
        location.pathname !== "/signup" && <BottomNav />}
    </>
  );
};


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><OrderCreate /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/price" element={<PrivateRoute><PriceList /></PrivateRoute>} />

          {/* 🔥 PROFILE ADD */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;