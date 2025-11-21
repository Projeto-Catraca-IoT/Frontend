import { useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"

function Register() {
  const navigate = useNavigate();
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const repeatPasswordRef = useRef()

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
        toast.error('Connection error. Check your internet.')
      } else {
        toast.error('Unexpected error')
        console.log(error.message)
      }
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
          <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">Registro de conta</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              ref={nameRef}
              className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
              type="text"
              placeholder="Seu nome"
              required
            />
            <input
              ref={emailRef}
              className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
              type="email"
              placeholder="Email"
              required
            />
            <input
              ref={passwordRef}
              className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
              type="password"
              placeholder="Senha"
              required
            />
            <input
              ref={repeatPasswordRef}
              className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
              type="password"
              placeholder="Repitir senha"
              required
            />
            <button
              type="submit"
              className="w-full mt-2 bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer"
            >
              Register
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-text-secondary hover:text-purple-primary text-sm"
            >
              Já possui conta? Faça seu login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register