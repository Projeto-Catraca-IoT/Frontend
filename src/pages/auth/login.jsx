import { useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"
import api from "../../services/api"
import { Eye, EyeOff } from "lucide-react"

function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  // 👁️ estado para mostrar/esconder senha
  const [showPassword, setShowPassword] = useState(false)

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
      }, { withCredentials: true })

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
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">

      <div className="max-w-md w-full">

        {/* LOGO */}
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
          <span className="text-text-primary">Smart</span>
          <span className="text-green-logo">Gate</span>
         
          <div className="w-26 h-[5px] bg-purple-secondary mx-auto mt-2 rounded-full"></div>
        </h1>

        {/* CARD */}
        <div className="bg-bg-secondary p-10 rounded-2xl shadow-xl border border-line/20
                        backdrop-blur-sm transition-all">

          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Login
          </h2>

          {/* FORMULÁRIO */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-text-primary font-medium mb-1">Email</label>
              <input
                ref={emailRef}
                className="w-full px-4 py-3 bg-secondary text-text-primary border border-line 
                           rounded-lg focus:outline-none focus:border-blue-900 shadow-sm 
                           transition-all"
                type="email"
                placeholder="Digite seu email"
                disabled={loading}
                required
              />
            </div>

            {/* Senha com olhinho */}
            <div className="flex flex-col relative">
              <label className="text-text-primary font-medium mb-1">Senha</label>
              <input
                ref={passwordRef}
                className="w-full px-4 py-3 bg-secondary text-text-primary border border-line 
                           rounded-lg focus:outline-none focus:border-blue-900 shadow-sm 
                           transition-all pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                disabled={loading}
                required
              />

              {/* Botão do olhinho */}
              <button
                type="button"
                className="absolute right-4 top-10 text-text-secondary hover:text-blue-900"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* BOTÃO VERDE ESCURO */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-green-700 hover:bg-green-600 text-white font-semibold 
                         py-3 rounded-lg shadow-md hover:shadow-lg transition-all 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* LINK PARA REGISTRAR */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-blue-900 hover:text-blue-700 text-sm font-medium transition"
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
