import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { toast } from "react-toastify"
import DashboardLayout from "../global/dashboardLayout"
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

function AllSecrets() {
    const { logout, getToken } = useAuth()
    const navigate = useNavigate()
    const [allSecrets, setAllSecrets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const loadSecrets = async (filter = "") => {
        try {
            setLoading(true)
            setError(null)

            const token = getToken()
            if (!token) {
                logout()
                navigate('/login')
                return
            }

            const url = filter ? `/secrets?filter=${encodeURIComponent(filter)}` : "/secrets/"

            const response = await api.get(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAllSecrets(response.data.data)

        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else if (error.response?.status !== 404) {
                setError(true)
                toast.error(error.response?.data?.message || 'Error to find secrets')
            } else {
                setAllSecrets([])
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSecrets()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSecrets(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    if (loading) {
        return <div className="flex justify-center items-center h-60"><span className="text-text-secondary">Carregando...</span></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-60">
                <span className="text-red-500 mb-2">Erro ao buscar secrets</span>
                <button className="mt-2 px-4 py-2 bg-purple-primary text-white rounded-md" onClick={() => loadSecrets(searchTerm)}>Tentar novamente</button>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col items-start justify-start mt-1 p-1 rounded">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full px-1 mb-1">
                    <h2 className="text-2xl font-bold text-text-primary">Secrets</h2>
                    <input
                        className="bg-bg-secondary border border-line p-1 sm:p-2 md:p-2.5 rounded-lg w-full sm:w-64 md:w-80 text-sm md:text-base text-text-primary placeholder-gray-500 focus:border-purple-500/60 focus:outline-none transition-colors"
                        type="text"
                        placeholder="Search secrets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {error && (
                    <p className="mt-2 text-text-secondary">Error to found secrets</p>
                )}

                {!error && (
                    <div className="rounded-md p-1 w-full">
                        {allSecrets && allSecrets.length > 0 ? (
                            <ul className="space-y-1">
                                {allSecrets.map((secret) => (
                                    <li
                                        key={secret.id}
                                        className="relative bg-bg-secondary border border-line p-4 rounded-lg border-l hover:bg-bg-secondary-hover cursor-pointer transition-colors"
                                        onClick={() => navigate(`/secret/${secret.id}`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col items-start gap-3">
                                                <p className="text-text-primary font-medium">{secret.name}</p>
                                                <p className="text-text-secondary text-sm">{secret.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <div className="bg-purple-secondary text-text-primary px-2 py-1 rounded-full text-sm font-medium w-max">
                                                    {secret.group}
                                                </div>
                                                <p className="text-sm text-text-secondary">
                                                    Updated: {dayjs(secret.updated_at).format("DD/MM/YYYY HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center w-full h-80 justify-center gap-1">
                                <img src="/disease.png" alt="Confused person" className="w-40" />
                                <p className="text-text-secondary">
                                    {searchTerm ? "No secrets found" : "No secrets here"}
                                </p>
                                {!searchTerm && (
                                    <button
                                        className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-2 py-1 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
                                        onClick={() => navigate("/secret/create")}
                                    >
                                        New Secret
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default AllSecrets