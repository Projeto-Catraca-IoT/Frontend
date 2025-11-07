import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    
    setLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
    toast.success("Logged in successfully")
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    toast.info("Logged out")
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    getToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}