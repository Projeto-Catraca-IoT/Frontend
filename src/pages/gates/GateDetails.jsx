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
  <div className="flex flex-col gap-6 mt-4">

    {/* HEADER */}
    <div className="flex items-center justify-between w-full bg-bg-secondary p-4 rounded-lg   ">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/locale/gates/${gate.location_id}`)}
          className="p-2 rounded-lg hover:bg-bg-secondary-hover transition"
        >
          <ArrowLeft size={22} className="text-text-primary" />
        </button>

        <h2 className="text-2xl font-extrabold text-text-primary tracking-wide">
          Detalhes da Catraca
        </h2>
      </div>

      <button
        className="px-5 py-2 btn-edit flex items-center gap-2"
        onClick={() => navigate(`/gate/edit/${gate.id}`)}
      >
        Editar
      </button>
    </div>

    {/* CARD PRINCIPAL */}
    <div className="bg-bg-secondary border border-line rounded-2xl p-6 w-full shadow-sm hover:shadow-lg transition">

      {/* IDENTIFICADOR + STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

        {/* IDENTIFICADOR */}
        <div>
          <label className="text-text-secondary text-sm font-semibold flex items-center gap-2 mb-1">
            <Tag size={18} />
            Identificador
          </label>
          <p className="text-text-primary text-xl font-bold">
            {gate.tag}
          </p>
        </div>

        {/* STATUS */}
        <div>
          <label className="text-text-secondary text-sm font-semibold flex items-center gap-2 mb-1">
            <Activity size={18} />
            Status
          </label>
          <span
            className={`
              px-5 py-2 rounded-full text-sm font-semibold 
              ${gate.status === "ativado"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
              }
            `}
          >
            {gate.status === "ativado" ? "Ativado" : "Desativado"}
          </span>
        </div>

      </div>

      {/* MOVIMENTAÇÕES */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
          <History size={18} />
          Movimentações
        </h3>

        <div className="border border-line rounded-lg p-4 bg-bg shadow-inner">

          {loadingLogs ? (
            <p className="text-text-secondary">Carregando movimentações...</p>
          ) : logs.length > 0 ? (
            <div className="flex flex-col gap-3">

              {/* Cabeçalho */}
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <p className="font-semibold text-text-primary">Operação</p>
                <p className="font-semibold text-text-primary">Data</p>
              </div>

              {/* LISTA */}
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-1 border-b border-line/60 last:border-none"
                >
                  <p className="text-text-primary">{log.operation}</p>
                  <p className="text-text-secondary">
                    {dayjs(log.created_at).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-text-secondary">Sem movimentações registradas.</p>
          )}

        </div>
      </div>

      {/* DATAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-line">

        {gate.created_at && (
          <div>
            <label className="text-text-secondary text-xs uppercase font-semibold tracking-wide">
              Criada em
            </label>
            <p className="text-text-primary text-sm mt-1">
              {dayjs(gate.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        )}

        {gate.updated_at && (
          <div>
            <label className="text-text-secondary text-xs uppercase font-semibold tracking-wide">
              Atualizada em
            </label>
            <p className="text-text-primary text-sm mt-1">
              {dayjs(gate.updated_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        )}

      </div>
    </div>

  </div>
</Layout>

    )
}

export default GateDetails