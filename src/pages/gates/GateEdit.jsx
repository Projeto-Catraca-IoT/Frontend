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

            // Preenche o formulário com os dados existentes
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
        if (id) {
            loadGate()
        }
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
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
                {
                    tag: formData.tag,
                    status: formData.status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            toast.success(data.message || "Catraca atualizada com sucesso")
            navigate(`/gate/${id}`)
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
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        try {
            setSubmitting(true)
            const token = getToken()

            if (!token) {
                logout()
                navigate('/login')
                return
            }

            const { data } = await api.delete(`/gates/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success(data.message || "Catraca excluída com sucesso")
            navigate(`/locale/gates/${formData.location_id}`)
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Erro ao excluir catraca')
            }
        } finally {
            setSubmitting(false)
            setShowDeleteModal(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-60 w-full">
                    <span className="text-text-secondary">Carregando dados...</span>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="mt-10 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-bg-secondary p-8 rounded-lg border border-line">
                        <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">
                            Editar Catraca
                        </h2>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-text-secondary text-sm font-medium mb-1 block">
                                    Identificador da Catraca
                                </label>
                                <input
                                    name="tag"
                                    value={formData.tag}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
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
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-primary"
                                >
                                    <option value="ativado">Ativado</option>
                                    <option value="desativado">Desativado</option>
                                </select>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer hover:bg-purple-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                                <button
                                    type="button"
                                    disabled={submitting}
                                    className="w-full bg-bg-secondary border border-line text-red-400 py-2 px-4 rounded-md cursor-pointer hover:bg-bg-secondary-hover disabled:opacity-50"
                                    onClick={() => navigate(`/gate/${id}`)}
                                >
                                    Cancelar
                                </button>
                            </div>

                            {/* Botão de Excluir */}
                            <div className="pt-4 border-t border-line">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 size={18} />
                                    Excluir Catraca
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Modal de Confirmação */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-bg-secondary border border-line rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold text-text-primary mb-2">
                                Confirmar Exclusão
                            </h3>
                            <p className="text-text-secondary mb-6">
                                Tem certeza que deseja excluir a catraca "<strong className="text-text-primary">{formData.tag}</strong>"?
                                Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={submitting}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Excluindo...' : 'Sim, Excluir'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={submitting}
                                    className="flex-1 bg-bg-secondary border border-line text-text-primary py-2 px-4 rounded-md cursor-pointer hover:bg-bg-secondary-hover disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default GateEdit