import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import Layout from '../global/Layout'
import api from "../../services/api"
import { ArrowLeft, Plus } from "lucide-react" // Adicionei 'Plus' para o botão

function GateList() {
    const { id: routeId } = useParams()
    const { state } = useLocation()
    // Garante que o ID do local seja pego da rota ou do state
    const id = routeId || state?.locationId

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

            // 1. Carrega informações do local
            const locationResponse = await api.get(`/locations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLocation(locationResponse.data.data)

            // 2. Carrega catracas
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

    // --- Estado de Carregamento ---
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
            <div className="flex flex-col items-start justify-start mt-1 p-2 rounded w-full gap-6">

                {/* HEADER PADRONIZADO */}
                <div className="flex w-full justify-between items-center mb-4">
                    <div className='flex items-center gap-4'>
                        {/* Botão de Voltar para os Detalhes do Local */}
                         <button
                                  onClick={() => navigate(`/locale/${id}`)}
                                  className="p-2 rounded-lg hover:bg-bg-secondary-hover transition"
                                >
                                  <ArrowLeft size={22} className="text-text-primary" />
                                </button>
                        
                        <div>
                            {/* Usando header-strong */}
                            <h2 className="header-strong">
                                Catracas do Local
                            </h2>
                            {location && (
                                <p className="text-text-secondary text-base font-medium">
                                    {location.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botão de Ação */}
                    <button
                        className="btn-green flex items-center gap-2"
                        onClick={() => navigate("/gate/create", { state: { locationId: id } })}
                    >
                        <Plus size={16} /> Cadastrar Catraca
                    </button>
                </div>

                {/* --- CONTEÚDO --- */}

                {/* Lista de Catracas */}
                {gates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                        {gates.map((gate) => (
                            <div
                                key={gate.id}
                                // Usando card-modern para consistência visual com List.js
                                className="card-modern"
                                onClick={() => navigate(`/gate/${gate.id}`)}
                            >
                                <div className="flex flex-col gap-3">
                                    
                                    {/* Identificador/Nome */}
                                    <div>
                                        <p className="text-text-secondary text-xs font-medium mb-1">
                                            Identificador
                                        </p>
                                        <p className="text-text-primary font-bold text-xl truncate">
                                            {gate.tag}
                                        </p>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-line">
                                        <span className="text-text-secondary text-sm">
                                            Status
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${gate.status === 'ativado'
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
                    // Estado Vazio
                    <div className="flex flex-col items-center justify-center w-full h-80 gap-4 bg-bg-secondary border border-line rounded-lg p-6">
                        <div className="text-center">
                            <p className="text-text-secondary mb-2 text-lg">
                                Nenhuma catraca cadastrada neste local.
                            </p>
                            <p className="text-text-secondary text-sm">
                                Use o botão acima para adicionar uma catraca e começar o controle de acesso.
                            </p>
                        </div>
                        {/* Adiciona o botão de cadastrar novamente no estado vazio */}
                        <button
                            className="btn-green flex items-center gap-2 mt-4"
                            onClick={() => navigate("/gate/create", { state: { locationId: id } })}
                        >
                            <Plus size={16} /> Cadastrar Catraca
                        </button>
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default GateList