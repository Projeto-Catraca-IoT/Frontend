import { useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"
import api from "../../services/api"

function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', {
        email: email,
        password: password
      }, {
        withCredentials: true
      })

      if (data && data.token) {
        login(data.token)
        navigate('/dashboard')
      } else {
        toast.error('Resposta inválida do servidor')
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error.response) {
        toast.error(error.response.data?.message || 'Login error')
      } else if (error.request) {
        toast.error('Erro de conexão. Verifique sua internet')
      } else {
        toast.error('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="max-w-md w-full mx-4">

        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
          <span className="text-text-primary">Smart</span>
          <span className="text-green-logo">Gate</span>

          <div className="w-28 h-[5px] bg-purple-secondary mx-auto mt-2 rounded-full"></div>
        </h1>

        <div className="bg-bg-secondary p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">Login</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              ref={emailRef}
              className="w-full px-3 py-2 bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
              type="email"
              placeholder="Email"
              disabled={loading}
              required
            />
            <input
              ref={passwordRef}
              className="w-full px-3 py-2 bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
              type="password"
              placeholder="Senha"
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Entrando...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="text-text-secondary hover:text-purple-primary text-sm"
            >
              Não possui conta? Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login