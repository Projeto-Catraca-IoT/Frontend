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
import LocaleEdit from "./pages/locales/LocaleEdit"
import LocaleDetails from "./pages/locales/LocaleDetails"
import GateCreate from "./pages/gates/GateCreate"
import DashboardLayout from "./pages/global/DashboardLayout"
import GateList from "./pages/gates/GateList"
import GateDetails from "./pages/gates/GateDetails"
import GateEdit from "./pages/gates/GateEdit"

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
              path="/gate/:id"
              element={
                <ProtectedRoute>
                  <GateDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
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
              path="/locale/edit/:id"
              element={
                <ProtectedRoute>
                  <LocaleEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gate/edit/:id"
              element={
                <ProtectedRoute>
                  <GateEdit />
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
            <Route
              path="/locale/gates/:id"
              element={
                <ProtectedRoute>
                  <GateList />
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