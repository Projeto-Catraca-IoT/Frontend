import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import Layout from '../global/Layout'
import api from "../../services/api"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import { ArrowLeft, MapPin, Users, ExternalLink } from "lucide-react"

function LocaleDetails() {
  const { id } = useParams()
  const { logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)

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
      console.log('Location data:', data.data)
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

  useEffect(() => {
    if (id) {
      loadLocation()
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

  if (!location) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-60 w-full">
          <span className="text-red-500 mb-2">Local não encontrado</span>
          <button
            className="mt-2 px-4 py-2 bg-purple-primary text-white rounded-md"
            onClick={() => navigate('/')}
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

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className='flex items-center gap-2'>
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-bg-secondary p-2 rounded-lg transition-colors hover:cursor-pointer"
            >
              <ArrowLeft size={20} className="text-text-primary" />
            </button>
            <h2 className="text-2xl font-bold text-text-primary">Detalhes do Local</h2>
          </div>
          <div className='flex gap-2'>
            <button
              className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-4 py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
              onClick={() => navigate(`/locale/edit/${location.id}`)}
            >
              Editar
            </button>
            <button
              className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-4 py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
              onClick={() => navigate("/gate/create", { state: { locationId: location.id } })}
            >
              Cadastrar Catraca
            </button>
            <button
              className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-4 py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
              onClick={() => navigate(`/locale/gates/${id}`)}
            >
              Ver Catracas
            </button>
          </div>
        </div>

        {/* Card com informações */}
        <div className="bg-bg-secondary border border-line rounded-lg p-6 w-full">
          <div className="space-y-4">

            {/* Nome */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-1 block">
                Nome do Local
              </label>
              <p className="text-text-primary text-lg font-semibold">
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
                    className="flex items-center gap-1 text-purple-primary hover:text-purple-primary-hover text-sm"
                  >
                    Ver no mapa
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Capacidade */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-1 flex items-center gap-1">
                <Users size={16} />
                Lotação
              </label>
              <div className="flex items-center gap-3">
                <span className="text-text-primary text-2xl font-bold">
                  {location.current_people}
                </span>
                <span className="text-text-secondary text-lg">
                  /
                </span>
                <span className="text-text-secondary text-lg">
                  {location.max_people} pessoas
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
            </div>

            {/* Descrição */}
            {location.description && (
              <div>
                <label className="text-text-secondary text-sm font-medium mb-1 block">
                  Descrição
                </label>
                <p className="text-text-primary">
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
                <p className="text-text-primary text-sm">
                  {dayjs(location.created_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div>
                <label className="text-text-secondary text-xs font-medium mb-1 block">
                  Atualizado em
                </label>
                <p className="text-text-primary text-sm">
                  {dayjs(location.updated_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  )
}

export default LocaleDetails