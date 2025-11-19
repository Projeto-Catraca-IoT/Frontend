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
        <Layout>
            <div className="mt-10 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-bg-secondary p-8 rounded-lg border border-line">
                        <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">
                            Cadastrar Catraca
                        </h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-text-secondary text-sm font-medium mb-1 block">
                                    Identificador da Catraca
                                </label>
                                <input
                                    ref={tagRef}
                                    className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary"
                                    type="text"
                                    placeholder="Ex: catraca_01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-text-secondary text-sm font-medium mb-1 block">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary"
                                >
                                    <option value="ativado">Ativado</option>
                                    <option value="desativado">Desativado</option>
                                </select>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer hover:bg-purple-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="w-full bg-bg-secondary border border-line text-red-400 py-2 px-4 rounded-md cursor-pointer hover:bg-bg-secondary-hover disabled:opacity-50"
                                    onClick={() => navigate(`/locale/${locationId}`)}
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