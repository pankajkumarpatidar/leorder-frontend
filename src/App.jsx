import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrderCreate from "./pages/OrderCreate";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";

import BottomNav from "./components/BottomNav";

// 🔒 Private Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

// 🔥 Layout (Bottom nav control)
const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {children}

      {/* Login page pe nav hide */}
      {location.pathname !== "/" && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* 🔓 Public */}
          <Route path="/" element={<Login />} />

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