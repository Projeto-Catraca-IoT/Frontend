import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import Layout from '../global/Layout'
import api from "../../services/api"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import { ArrowLeft, Tag, Activity, History, Logs } from "lucide-react"

function GateDetails() {
    const { id } = useParams()
    const { logout, getToken } = useAuth()
    const navigate = useNavigate()
    const [gate, setGate] = useState(null)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingLogs, setLoadingLogs] = useState(false)

    const loadGate = async () => {
        try {
            setLoading(true)
            const token = getToken()

            if (!token) {
                logout()
                navigate('/login')
                return
            }

            // Carrega detalhes da catraca específica
            const { data } = await api.get(`/gates/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setGate(data.data)

            // Carrega logs da catraca
            loadLogs(token)
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else {
                toast.error(error.response?.data?.message || 'Erro ao carregar catraca')
            }
        } finally {
            setLoading(false)
        }
    }

    const loadLogs = async (token) => {
        try {
            setLoadingLogs(true)

            // Carrega logs de movimentações da catraca
            const { data } = await api.get(`/gates/${id}/history`, {
                headers: {
                    Authorization: `Bearer ${token || getToken()}`
                }
            })

            console.log(data.data)
            setLogs(data.data)
            console.log(logs)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao carregar logs da catraca')
            setLogs([])
        } finally {
            setLoadingLogs(false)
        }
    }

    useEffect(() => {
        if (id) {
            loadGate()
        }
    }, [id])

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-60 w-full">
                    <span className="text-text-secondary">Carregando detalhes...</span>
                </div>
            </Layout>
        )
    }

    if (!gate) {
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-60 w-full">
                    <span className="text-red-500 mb-2">Catraca não encontrada</span>
                    <button
                        className="mt-2 px-4 py-2 bg-purple-primary text-white rounded-md"
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </button>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="flex flex-col items-start justify-start mt-1 p-1 rounded gap-4">

                <div className="flex items-center justify-between w-full">
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => navigate(`/locale/${gate.location_id}`)}
                            className="hover:bg-bg-secondary p-2 rounded-lg transition-colors hover:cursor-pointer"
                        >
                            <ArrowLeft size={20} className="text-text-primary" />
                        </button>
                        <h2 className="text-2xl font-bold text-text-primary">
                            Detalhes da Catraca
                        </h2>
                    </div>
                    <button
                        className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-4 py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
                        onClick={() => navigate(`/gate/edit/${gate.id}`)}
                    >
                        Editar
                    </button>
                </div>

                <div className="bg-bg-secondary border border-line rounded-lg p-6 w-full">
                    <div className="space-y-4">

                        <div className='flex justify-between'>
                            {/* Identificador/Tag */}
                            <div>
                                <label className="text-text-secondary text-sm font-medium mb-1 flex items-center gap-1">
                                    <Tag size={16} />
                                    Identificador
                                </label>
                                <p className="text-text-primary text-lg font-semibold">
                                    {gate.tag}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-text-secondary text-sm font-medium mb-1 flex items-center gap-1">
                                    <Activity size={16} />
                                    Status
                                </label>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${gate.status === 'ativado'
                                            ? 'bg-green-500/20 text-green-500'
                                            : 'bg-red-500/20 text-red-500'
                                            }`}
                                    >
                                        {gate.status === 'ativado' ? 'Ativado' : 'Desativado'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className=''>
                            <h2>Movimentações:</h2>
                            <div className='border border-line rounded-lg p-2 bg-bg'>
                                {logs.length > 0 ? (
                                    <>
                                        <div className="flex flex-col">
                                            <div className='flex justify-between mb-4'>
                                                <p className='text-text-primary font-bold'>Operação</p>
                                                <p className='text-text-primary font-bold'>Data</p>
                                            </div>
                                            {logs.map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="flex justify-between"
                                                >
                                                    <div className="flex justify-between mb-1 w-full">
                                                        <p>
                                                            {log.operation}
                                                        </p>
                                                        <p>{dayjs(log.created_at).format("DD/MM/YYYY HH:mm")}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex w-full justify-between gap-1 items-center m-2">
                                        <p className="text-text-secondary">Sem movimentações por aqui</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Datas */}
                        {(gate.created_at || gate.updated_at) && (
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
                                {gate.created_at && (
                                    <div>
                                        <label className="text-text-secondary text-xs font-medium mb-1 block">
                                            Criada em
                                        </label>
                                        <p className="text-text-primary text-sm">
                                            {dayjs(gate.created_at).format("DD/MM/YYYY HH:mm")}
                                        </p>
                                    </div>
                                )}
                                {gate.updated_at && (
                                    <div>
                                        <label className="text-text-secondary text-xs font-medium mb-1 block">
                                            Atualizada em
                                        </label>
                                        <p className="text-text-primary text-sm">
                                            {dayjs(gate.updated_at).format("DD/MM/YYYY HH:mm")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default GateDetails