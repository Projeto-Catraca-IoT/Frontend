import { useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"
import { Eye, EyeOff } from "lucide-react"

function Register() {
  const navigate = useNavigate()
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const repeatPasswordRef = useRef()

  // Estados para mostrar/esconder senha
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const { data } = await api.post('/auth/register', {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        repeat_password: repeatPasswordRef.current.value
      })

      toast.success(data.message)
      navigate('/login')

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message)
      } else if (error.request) {
        toast.error('Erro de conexão. Verifique sua internet.')
      } else {
        toast.error('Erro inesperado')
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">

      <div className="max-w-md w-full">

        {/* LOGO */}
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
          <span className="text-text-primary">Smart</span>
          <span className="text-green-logo">Gate</span>

          <div className="w-28 h-[5px] bg-purple-secondary mx-auto mt-2 rounded-full"></div>
        </h1>

        {/* CARD */}
        <div className="bg-bg-secondary p-10 rounded-2xl shadow-xl border border-line/20 backdrop-blur-sm">

          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Criar Conta
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Nome */}
            <div className="flex flex-col">
              <label className="text-text-primary font-medium mb-1">Nome</label>
              <input
                ref={nameRef}
                className="w-full px-4 py-3 bg-secondary text-text-primary border border-line 
                           rounded-lg focus:outline-none focus:border-blue-900 shadow-sm transition-all"
                type="text"
                placeholder="Digite seu nome"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-text-primary font-medium mb-1">Email</label>
              <input
                ref={emailRef}
                className="w-full px-4 py-3 bg-secondary text-text-primary border border-line 
                           rounded-lg focus:outline-none focus:border-blue-900 shadow-sm transition-all"
                type="email"
                placeholder="Digite seu email"
                required
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col relative">
              <label className="text-text-primary font-medium mb-1">Senha</label>
              <input
                ref={passwordRef}
                className="w-full px-4 py-3 bg-secondary text-text-primary border border-line 
                           rounded-lg focus:outline-none focus:border-blue-900 shadow-sm transition-all pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                required
              />

              {/* Botão para mostrar/esconder */}
              <button
                type="button"
                className="absolute right-4 top-10 text-text-secondary hover:text-blue-900"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Repetir Senha */}
            <div className="flex flex-col relative">
              <label className="text-text-primary font-medium mb-1">Repetir Senha</label>
              <input
                ref={repeatPasswordRef}
                className="w-full px-4 py-3 bg-secondary text-text-primary border border-line 
                           rounded-lg focus:outline-none focus:border-blue-900 shadow-sm transition-all pr-12"
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repita sua senha"
                required
              />

              {/* Botão para mostrar/esconder */}
              <button
                type="button"
                className="absolute right-4 top-10 text-text-secondary hover:text-blue-900"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              >
                {showRepeatPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="w-full mt-2 bg-green-700 hover:bg-green-600 text-white font-semibold 
                         py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Registrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-900 hover:text-blue-700 text-sm font-medium transition"
            >
              Já possui conta? Faça login
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register
