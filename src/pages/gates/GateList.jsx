import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import Layout from '../global/Layout'
import api from "../../services/api"
import { ArrowLeft, Plus } from "lucide-react"

function GateList() {
    const { id: routeId } = useParams() // ID da URL (ex: /locale/gates/:id)
    const { state } = useLocation()     // fallback caso o ID venha via navigate state
    const id = routeId || state?.locationId // garante que sempre haja um ID válido

    const { logout, getToken } = useAuth()
    const navigate = useNavigate()
    const [gates, setGates] = useState([])
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadGates = async () => {
        try {
            setLoading(true)
            const token = getToken()

            if (!token) {
                logout()
                navigate('/login')
                return
            }

            if (!id) {
                toast.error("Local não identificado")
                navigate("/")
                return
            }

            // Carrega informações do local
            const locationResponse = await api.get(`/locations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLocation(locationResponse.data.data)

            // Carrega catracas
            const gatesResponse = await api.get(`/locations/${id}/gates`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setGates(gatesResponse.data?.data || [])
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else {
                toast.error(error.response?.data?.message || 'Erro ao carregar catracas')
                setGates([])
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) loadGates()
    }, [id])

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-60 w-full">
                    <span className="text-text-secondary">Carregando catracas...</span>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="flex flex-col items-start justify-start mt-1 p-1 rounded gap-4">

                {/* Header */}
                <div className="flex items-center justify-between w-full">
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => navigate(`/location/${id}`)}
                            className="hover:bg-bg-secondary p-2 rounded-lg transition-colors hover:cursor-pointer"
                        >
                            <ArrowLeft size={20} className="text-text-primary" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary">Catracas</h2>
                            {location && (
                                <p className="text-text-secondary text-sm">{location.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Catracas */}
                {gates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                        {gates.map((gate) => (
                            <div
                                key={gate.id}
                                className="bg-bg-secondary border border-line rounded-lg hover:bg-bg-secondary-hover hover:border-purple-primary cursor-pointer transition-all p-4"
                                onClick={() => navigate(`/gate/${gate.id}`)}
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Tag/Identificador */}
                                    <div>
                                        <p className="text-text-secondary text-xs font-medium mb-1">
                                            Identificador
                                        </p>
                                        <p className="text-text-primary font-semibold text-lg truncate">
                                            {gate.tag}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between pt-3 border-t border-line">
                                        <span className="text-text-secondary text-sm">
                                            Status
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${gate.status === 'ativado'
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-red-500/20 text-red-500'
                                                }`}
                                        >
                                            {gate.status === 'ativado' ? 'Ativado' : 'Desativado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
                        <div className="text-center">
                            <p className="text-text-secondary mb-2">
                                Nenhuma catraca cadastrada neste local
                            </p>
                            <p className="text-text-secondary text-sm">
                                Adicione uma catraca para começar o controle de acesso
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default GateList
