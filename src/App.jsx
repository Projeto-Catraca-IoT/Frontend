import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Register from "./pages/auth/register"
import Login from "./pages/auth/login"
import Layout from "./pages/global/Layout"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LocaleCreate from "./pages/locales/LocaleCreate"
import AllSecrets from "./pages/secrets/AllSecrets"
import LocaleDetails from "./pages/locales/LocaleDetails"
import GateCreate from "./pages/gates/GateCreate"

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return;
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
}

function App() {
  return (
    <div className="bg-black min-h-screen">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AllSecrets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/locale/create"
              element={
                <ProtectedRoute>
                  <LocaleCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/locale/:id"
              element={
                <ProtectedRoute>
                  <LocaleDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gate/create"
              element={
                <ProtectedRoute>
                  <GateCreate />
                </ProtectedRoute>
              }
            />
            {/* Root route */}
            <Route path="/" element={<RootRedirect />} />
            {/* 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer />
    </div>
  )
}

export default App