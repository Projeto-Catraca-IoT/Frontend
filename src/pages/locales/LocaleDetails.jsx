import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import Layout from '../global/Layout'
import api from "../../services/api"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import { ArrowLeft, MapPin, Users, ExternalLink, History } from "lucide-react"

function LocaleDetails() {
  const { id } = useParams()
  const { logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  const loadLocation = async () => {
    try {
      setLoading(true)
      const token = getToken()

      if (!token) {
        logout()
        navigate('/login')
        return
      }

      const { data } = await api.get(`/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setLocation(data.data)

      // Carrega os logs após carregar o local
      loadLogs(token)
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      } else {
        toast.error(error.response?.data?.message || 'Erro ao carregar local')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async (token) => {
    try {
      setLoadingLogs(true)

      const { data } = await api.get(`/locations/${id}/history`, {
        headers: {
          Authorization: `Bearer ${token || getToken()}`
        }
      })

      setLogs(data?.data ?? [])
    } catch (error) {
      // Não mostra erro se não houver logs
      setLogs([])
    } finally {
      setLoadingLogs(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadLocation()
    }
  }, [id])

  // --- Estados de Carregamento/Erro ---

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-60 w-full">
          <span className="text-text-secondary">Carregando detalhes...</span>
        </div>
      </Layout>
    )
  }

  if (!location) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-60 w-full">
          <span className="text-red-500 mb-4">Local não encontrado</span>
          <button
            className="btn-green" // Usando a classe de botão do componente List
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar para a lista
          </button>
        </div>
      </Layout>
    )
  }

  // --- Renderização Principal ---

  return (
    <Layout>
      <div className="flex flex-col items-start justify-start mt-1 p-2 rounded w-full gap-6">

        {/* HEADER (Mais parecido com o do List.js) */}
        <div className="flex w-full justify-between items-center mb-4">
          
          <div className='flex items-center gap-4'>
             <button
                   onClick={() => navigate('/')}
                  className="p-2 rounded-lg hover:bg-bg-secondary-hover transition"
                    >
                <ArrowLeft size={22} className="text-text-primary" />
                </button>
            {/* Usando a classe header-strong do List.js */}
            <h2 className="header-strong">
              Detalhes do Local: {location.name}
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              className="btn-green" // Botão primário
              onClick={() => navigate(`/locale/gates/${id}`)}
            >
              Ver Catracas
            </button>
            <button
              className="btn-green" // Novo estilo para consistência
              onClick={() => navigate("/gate/create", { state: { locationId: location.id } })}
            >
              Cadastrar Catraca
            </button>
            <button
              className="btn-edit"  // Novo estilo para consistência
              onClick={() => navigate(`/locale/edit/${location.id}`)}
            >
              Editar Local
            </button>
          </div>
        </div>

        {/* Informações e Detalhes - Mantenho o estilo card-modern para consistência visual com List.js */}
        <div className="card-modern !shadow-lg flex flex-col p-6 w-full">
          <h3 className="text-xl font-bold text-text-primary mb-4 border-b border-line pb-2">Informações Gerais</h3>
          <div className="space-y-4">

            {/* Nome */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-1 block">
                Nome do Local
              </label>
              <p className="text-text-primary text-xl font-bold">
                {location.name}
              </p>
            </div>

            {/* Endereço */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-1 flex items-center gap-1">
                <MapPin size={16} />
                Endereço
              </label>
              <div className="flex items-center justify-between">
                <p className="text-text-primary">
                  {location.address}
                </p>
                {location.google_maps_url && (
                  <a
                    href={location.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-primary hover:text-purple-primary-hover text-sm font-medium transition-colors"
                  >
                    Ver no mapa
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Capacidade */}
            <div className='pt-2'>
              <label className="text-text-secondary text-sm font-medium mb-1 flex items-center gap-1">
                <Users size={16} />
                Lotação
              </label>
              <div className="flex items-center gap-4">
                <span className="text-text-primary text-3xl font-extrabold">
                  {location.current_people}
                </span>
                <span className="text-text-secondary text-xl">
                  /
                </span>
                <span className="text-text-secondary text-xl font-semibold">
                  {location.max_people}
                </span>
                <span className='text-text-secondary text-base'>
                  pessoas
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="mt-2 w-full bg-bg-primary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${(location.current_people / location.max_people) >= 0.9
                    ? 'bg-red-500'
                    : (location.current_people / location.max_people) >= 0.7
                      ? 'bg-yellow-500'
                      : 'bg-purple-primary'
                    }`}
                  style={{
                    width: `${Math.min((location.current_people / location.max_people) * 100, 100)}%`
                  }}
                />
              </div>

              <p className="text-text-secondary text-xs mt-1">
                {location.current_people === 0
                  ? 'Local vazio'
                  : location.current_people >= location.max_people
                    ? 'Capacidade máxima atingida'
                    : `${location.max_people - location.current_people} vagas disponíveis`
                }
              </p>
            </div>

            {/* Descrição */}
            {location.description && (
              <div className='pt-2'>
                <label className="text-text-secondary text-sm font-medium mb-1 block">
                  Descrição
                </label>
                <p className="text-text-primary leading-relaxed">
                  {location.description}
                </p>
              </div>
            )}

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
              <div>
                <label className="text-text-secondary text-xs font-medium mb-1 block">
                  Criado em
                </label>
                <p className="text-text-primary text-sm font-medium">
                  {dayjs(location.created_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div>
                <label className="text-text-secondary text-xs font-medium mb-1 block">
                  Atualizado em
                </label>
                <p className="text-text-primary text-sm font-medium">
                  {dayjs(location.updated_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Seção de Movimentações (Historico) */}
        <div className="card-modern !shadow-lg flex flex-col p-6 w-full">
          <div className="flex items-center gap-2 mb-4 border-b border-line pb-2">
            <History size={20} className="text-text-primary" />
            <h3 className="text-xl font-bold text-text-primary">Histórico de Movimentações</h3>
          </div>

          {loadingLogs ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-text-secondary">Carregando histórico...</span>
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto -mx-2"> {/* Remove padding horizontal do card para a tabela */}
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left text-text-secondary text-sm font-medium py-3 px-2">
                      Catraca
                    </th>
                    <th className="text-left text-text-secondary text-sm font-medium py-3 px-2">
                      Operação
                    </th>
                    <th className="text-right text-text-secondary text-sm font-medium py-3 px-2">
                      Data e Hora
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
                        <span className="text-text-primary text-sm font-medium">
                          Catraca **#{log.gate_id}**
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${log.operation === 'entrada'
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
                            {dayjs(log.created_at).format("DD/MM/YYYY")}
                          </span>
                          <span className="text-text-secondary text-xs">
                            {dayjs(log.created_at).format("HH:mm:ss")}
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
              <p className="text-text-secondary mb-2">Nenhuma movimentação registrada</p>
              <p className="text-text-secondary text-sm">
                As entradas e saídas aparecerão aqui.
              </p>
            </div>
          )}
        </div>

      </div>
    </Layout >
  )
}

export default LocaleDetails