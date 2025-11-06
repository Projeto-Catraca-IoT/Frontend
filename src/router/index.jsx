import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../context/AuthContext';

// Rota privada
function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Rota pública
function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

const AppRouter = () => (
  <Routes>
    {/* Rotas públicas */}
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Route>
    {/* Rotas privadas */}
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
    {/* Qualquer rota não definida */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRouter;
