import { useAuth } from "../../contexts/AuthContext"
import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"
import Layout from "../global/Layout"

function GateCreate() {
    const { logout, getToken } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const tagRef = useRef()
    const [status, setStatus] = useState("ativado")
    const [loading, setLoading] = useState(false)

    // Pega o location_id que foi enviado via navigate
    const locationId = location.state?.locationId
    console.log(locationId)

    // Se não tiver location_id, redireciona
    if (!locationId) {
        toast.error("Local não identificado")
        navigate("/")
        return null
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setLoading(true)
            const token = getToken()

            if (!token) {
                logout()
                navigate('/login')
                return
            }

            const { data } = await api.post('/gates',
                {
                    tag: tagRef.current.value,
                    location_id: locationId,
                    status: status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            toast.success(data.message || "Catraca cadastrada com sucesso")
            navigate(`/location/${locationId}`)
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else if (error.response) {
                toast.error(error.response.data.message)
            } else if (error.request) {
                toast.error('Erro de conexão. Confira sua internet')
            } else {
                toast.error('Erro inesperado')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout noWrapper>

  <div className="mt-12 flex items-center justify-center">
    <div className="max-w-md w-full mx-4">

      {/* CARD */}
      <div className="bg-bg-secondary p-8 rounded-2xl border border-line shadow-md shadow-black/5 hover:shadow-xl transition">
        
        {/* TÍTULO */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-text-primary tracking-wide">
          Cadastrar Catraca
        </h2>

        {/* FORM */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          {/* IDENTIFICADOR */}
          <div>
            <label className="text-text-primary text-sm font-semibold mb-1 block">
              Identificador da Catraca
            </label>
            <input
              ref={tagRef}
              className="
                w-full px-4 py-3 rounded-lg 
                bg-bg-secondary text-text-primary 
                border border-line 
                focus:outline-none 
                focus:border-purple-primary 
                focus:ring-2 focus:ring-purple-secondary/40
                placeholder:text-text-secondary
              "
              type="text"
              placeholder="Ex: catraca_01"
              required
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-text-primary text-sm font-semibold mb-1 block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg
                bg-bg-secondary text-text-primary
                border border-line
                focus:outline-none 
                focus:border-purple-primary 
                focus:ring-2 focus:ring-purple-secondary/40
              "
            >
              <option value="ativado">Ativado</option>
              <option value="desativado">Desativado</option>
            </select>
          </div>

          {/* BOTOES */}
          <div className="flex gap-3 pt-2">
            
            {/* BOTÃO CADASTRAR */}
            <button
              type="submit"
              disabled={loading}
              className="
                btn-green flex-1
              "
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

            {/* BOTÃO CANCELAR */}
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate(`/locale/${locationId}`)}
              className="
                flex-1 py-3 rounded-lg font-semibold
                bg-bg-secondary border border-line text-text-secondary
                hover:bg-bg-secondary-hover hover:text-text-primary
                transition
                disabled:opacity-50
              "
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</Layout>

    )
}

export default GateCreate