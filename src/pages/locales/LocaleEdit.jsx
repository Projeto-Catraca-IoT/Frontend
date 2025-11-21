import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"
import Layout from "../global/Layout"
import { Trash2 } from "lucide-react"

function LocaleEdit() {
    const { id } = useParams()
    const { logout, getToken } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        max_people: "",
        description: "",
        google_maps_url: "",
    })

    const loadLocation = async () => {
        try {
            setLoading(true)
            const token = getToken()

            if (!token) return logout(), navigate("/login")

            const { data } = await api.get(`/locations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setFormData({
                name: data.data.name || "",
                address: data.data.address || "",
                max_people: data.data.max_people || "",
                description: data.data.description || "",
                google_maps_url: data.data.google_maps_url || "",
            })
        } catch (error) {
            toast.error("Erro ao carregar local")
            navigate(`/location/${id}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLocation()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSubmitting(true)
            const token = getToken()

            if (!token) return logout(), navigate("/login")

            const { data } = await api.put(
                `/locations/${id}`,
                {
                    name: formData.name,
                    address: formData.address,
                    max_people: parseInt(formData.max_people),
                    description: formData.description || undefined,
                    google_maps_url: formData.google_maps_url || undefined,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            toast.success(data.message || "Local atualizado com sucesso")
            navigate(`/location/${id}`)
        } catch {
            toast.error("Erro ao salvar alterações")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        try {
            setSubmitting(true)
            const token = getToken()

            if (!token) return logout(), navigate("/login")

            const { data } = await api.delete(`/locations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            toast.success(data.message || "Local excluído")
            navigate("/")
        } catch {
            toast.error("Erro ao excluir local")
        } finally {
            setSubmitting(false)
            setShowDeleteModal(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-60">
                    <span className="text-text-secondary">Carregando...</span>
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
                            Editar Local
                        </h2>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            
                            {/* Nome */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Nome</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    focus:outline-none focus:border-purple-secondary transition"
                                    required
                                />
                            </div>

                            {/* Endereço */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Endereço</label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    focus:outline-none focus:border-purple-secondary transition"
                                    required
                                />
                            </div>

                            {/* Capacidade */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Capacidade Máxima</label>
                                <input
                                    name="max_people"
                                    type="number"
                                    min="1"
                                    value={formData.max_people}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    focus:outline-none focus:border-purple-secondary transition"
                                    required
                                />
                            </div>

                            {/* Google Maps */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">
                                    Google Maps (Opcional)
                                </label>
                                <input
                                    name="google_maps_url"
                                    type="url"
                                    value={formData.google_maps_url}
                                    onChange={handleChange}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    focus:outline-none focus:border-purple-secondary transition"
                                />
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">
                                    Descrição (Opcional)
                                </label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                    resize-none focus:outline-none focus:border-purple-secondary transition"
                                />
                            </div>

                            {/* Ações */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-purple-primary text-white py-2 px-4 rounded-md shadow 
                                    hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {submitting ? "Salvando..." : "Salvar"}
                                </button>

                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => navigate(`/location/${id}`)}
                                    className="w-full bg-bg border border-line text-text-primary py-2 px-4 rounded-md 
                                    hover:bg-bg-secondary-hover transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>


                            {/* Excluir */}
                            <div className="pt-4 border-t border-line">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 
                                    rounded-md hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    <Trash2 size={18} />
                                    Excluir Local
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-secondary p-6 border border-line rounded-xl max-w-md w-full shadow-xl">
                        <h3 className="text-xl font-bold text-text-primary mb-2">Confirmar Exclusão</h3>
                        <p className="text-text-secondary mb-6">
                            Tem certeza que deseja excluir <strong className="text-text-primary">{formData.name}</strong>?  
                            Esta ação é irreversível.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={submitting}
                                className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {submitting ? "Excluindo..." : "Excluir"}
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={submitting}
                                className="flex-1 bg-bg border border-line text-text-primary py-2 rounded-md 
                                hover:bg-bg-secondary-hover transition disabled:opacity-50"
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

export default LocaleEdit
