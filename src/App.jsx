import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅ ADD THIS
import Dashboard from "./pages/Dashboard";
import OrderCreate from "./pages/OrderCreate";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";

import BottomNav from "./components/BottomNav";

// 🔒 Private Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// 🔓 Public Route (login/signup block if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : children;
};

// 🔥 Layout (Bottom nav control)
const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {children}

      {/* Login + Signup pe nav hide */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <BottomNav />
      )}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* 🔓 Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 🔒 Protected */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/order"
            element={
              <PrivateRoute>
                <OrderCreate />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />

          {/* 🔁 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;