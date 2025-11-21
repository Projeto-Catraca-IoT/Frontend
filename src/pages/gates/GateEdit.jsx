import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"
import Layout from "../global/Layout"
import { Trash2 } from "lucide-react"

function GateEdit() {
    const { id } = useParams()
    const { logout, getToken } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        tag: '',
        status: 'ativado',
        location_id: null
    })

    const loadGate = async () => {
        try {
            setLoading(true)
            const token = getToken()

            if (!token) {
                logout()
                navigate('/login')
                return
            }

            const { data } = await api.get(`/gates/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setFormData({
                tag: data.data.tag || '',
                status: data.data.status || 'ativado',
                location_id: data.data.location_id
            })
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else {
                toast.error(error.response?.data?.message || 'Erro ao carregar catraca')
                navigate(-1)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) loadGate()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setSubmitting(true)
            const token = getToken()

            if (!token) {
                logout()
                navigate('/login')
                return
            }

            const { data } = await api.put(`/gates/${id}`,
                { tag: formData.tag, status: formData.status },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            toast.success(data.message || "Catraca atualizada com sucesso")
            navigate(`/gate/${id}`)
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao atualizar")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        try {
            setSubmitting(true)
            const token = getToken()

            const { data } = await api.delete(`/gates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            toast.success(data.message || "Catraca excluída")
            navigate(`/locale/gates/${formData.location_id}`)
        } catch {
            toast.error('Erro ao excluir catraca')
        } finally {
            setSubmitting(false)
            setShowDeleteModal(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-60 w-full">
                    <span className="text-text-primary font-medium">Carregando dados...</span>
                </div>
            </Layout>
        )
    }

    return (
        <Layout noWrapper>
            <div className="mt-12 flex justify-center">
                <div className="max-w-md w-full mx-4">
                    
                    <div className="bg-bg-secondary p-8 rounded-xl border border-line shadow-md">
                        <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">
                            Editar Catraca
                        </h2>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            
                            {/* Campo TAG */}
                            <div>
                                <label className="text-text-primary text-sm font-semibold mb-1 block">
                                    Identificador da Catraca
                                </label>
                                <input
                                    name="tag"
                                    value={formData.tag}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    focus:outline-none focus:border-purple-secondary transition"
                                    type="text"
                                    placeholder="Ex: catraca_01"
                                    required
                                />
                            </div>

                            {/* Campo Status */}
                            <div>
                                <label className="text-text-primary text-sm font-semibold mb-1 block">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    focus:outline-none focus:border-purple-secondary transition"
                                >
                                    <option value="ativado">Ativado</option>
                                    <option value="desativado">Desativado</option>
                                </select>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-purple-primary text-white py-2 px-4 rounded-md shadow 
                                    hover:opacity-90 cursor-pointer disabled:opacity-50 transition"
                                >
                                    {submitting ? 'Salvando...' : 'Salvar'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(`/gate/${id}`)}
                                    disabled={submitting}
                                    className="w-full bg-bg border border-line text-text-primary py-2 px-4 rounded-md 
                                    hover:bg-bg-secondary-hover cursor-pointer disabled:opacity-50 transition"
                                >
                                    Cancelar
                                </button>
                            </div>

                            {/* Excluir */}
                            <div className="pt-5 border-t border-line">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md 
                                    shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Trash2 size={18} />
                                    Excluir Catraca
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {/* Modal */}
     {showDeleteModal && (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-bg-secondary border border-line rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-text-primary mb-2">
                Confirmar Exclusão
            </h3>

            <p className="text-text-secondary mb-6">
                Tem certeza que deseja excluir esta catraca?
            </p>

            <div className="flex gap-2">
                <button
                    onClick={handleDelete}
                    disabled={submitting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                >
                    {submitting ? "Excluindo..." : "Sim, Excluir"}
                </button>

                <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={submitting}
                    className="flex-1 bg-bg-secondary border border-line text-text-primary py-2 px-4 rounded-md"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
)}

        </Layout>
    )
}

export default GateEdit
