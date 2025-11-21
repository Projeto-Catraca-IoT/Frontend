import { useAuth } from "../../contexts/AuthContext"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"
import Layout from "../global/Layout"

function LocaleCreate() {
    const { logout, getToken } = useAuth()
    const navigate = useNavigate()
    const nameRef = useRef()
    const addressRef = useRef()
    const maxPeopleRef = useRef()
    const descriptionRef = useRef()
    const [loading, setLoading] = useState(false)

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

            const { data } = await api.post('/locations',
                {
                    name: nameRef.current.value,
                    address: addressRef.current.value,
                    max_people: parseInt(maxPeopleRef.current.value),
                    description: descriptionRef.current.value || undefined
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            toast.success(data.message)
            navigate("/")
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

            <div className="mt-12 flex justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-bg-secondary p-8 rounded-xl border border-line shadow-md">
                        
                        <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">
                            Cadastrar Local
                        </h2>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            
                            <input
                                ref={nameRef}
                                className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                focus:outline-none focus:border-purple-secondary transition"
                                type="text"
                                placeholder="Nome do local"
                                required
                            />

                            <input
                                ref={addressRef}
                                className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                focus:outline-none focus:border-purple-secondary transition"
                                type="text"
                                placeholder="Endereço"
                                required
                            />

                            <input
                                ref={maxPeopleRef}
                                className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                focus:outline-none focus:border-purple-secondary transition"
                                type="number"
                                placeholder="Capacidade máxima de pessoas"
                                min="1"
                                required
                            />

                            <textarea
                                ref={descriptionRef}
                                className="w-full px-3 py-2 bg-bg text-text-primary border border-line rounded-md 
                                focus:outline-none focus:border-purple-secondary resize-none transition"
                                placeholder="Descrição (Opcional)"
                                rows="3"
                            />

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-primary text-white py-2 px-4 rounded-md shadow 
                                    hover:opacity-90 cursor-pointer transition disabled:opacity-50"
                                >
                                    {loading ? 'Criando...' : 'Criar Local'}
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => navigate("/")}
                                    className="w-full bg-bg border border-line text-text-primary py-2 px-4 rounded-md 
                                    hover:bg-bg-secondary-hover cursor-pointer transition disabled:opacity-50"
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

export default LocaleCreate
