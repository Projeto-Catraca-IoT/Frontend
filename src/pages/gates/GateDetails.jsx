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
                            onClick={() => navigate(`/locale/gates/${gate.location_id}`)}
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
                <div className="bg-bg-secondary border border-line rounded-lg p-6 w-full">
                    <div className="flex items-center gap-2 mb-4">
                        <History size={20} className="text-text-primary" />
                        <h3 className="text-xl font-bold text-text-primary">Movimentações</h3>
                    </div>
                    {logs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-line">
                                        <th className="text-left text-text-secondary text-sm font-medium py-3 px-2">
                                            Operação
                                        </th>
                                        <th className="text-right text-text-secondary text-sm font-medium py-3 px-2">
                                            Data
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-line hover:bg-bg-secondary-hover transition-colors"
                                        >
                                            <td className="py-3 px-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${log.operation === 'entrada'
                                                            ? 'bg-blue-500/20 text-blue-500'
                                                            : log.operation === 'saida'
                                                                ? 'bg-orange-500/20 text-orange-500'
                                                                : 'bg-gray-500/20 text-gray-500'
                                                        }`}
                                                >
                                                    {log.operation === 'entrada' ? 'Entrada' : log.operation === 'saida' ? 'Saída' : log.operation}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-text-primary text-sm font-medium">
                                                        {dayjs(log.created_at).format("DD/MM/YYYY HH:mm")}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-text-secondary mb-2">Sem movimentações por aqui</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default GateDetails