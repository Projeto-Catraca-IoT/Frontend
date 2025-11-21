import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../services/api"

function List() {
  const { logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLocations = async () => {
    try {
      setLoading(true)
      const token = getToken()

      if (!token) {
        logout()
        navigate('/login')
        return
      }

      const { data } = await api.get("/auth/locations", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setLocations(data?.data ?? [])
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      } else {
        setLocations([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 w-full">
        <span className="text-text-secondary">Carregando locais...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start justify-start mt-1 p-2 rounded w-full">

      {locations.length > 0 ? (
        <>
          {/* HEADER */}
          <div className="flex w-full justify-between items-center mb-4">
            <h2 className="header-strong">
              Seus locais cadastrados
            </h2>

            <button
              className="btn-green"
              onClick={() => navigate("/locale/create")}
            >
              Cadastrar Local
            </button>
          </div>

          {/* GRID CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {locations.map((location) => (
              <div
                key={location.id}
                className="card-modern"
                onClick={() => navigate(`/locale/${location.id}`)}
              >
                {/* TÍTULO */}
                <h3 className="text-text-primary font-bold text-xl mb-2 truncate">
                  {location.name}
                </h3>

                {/* DESCRIÇÃO */}
                {location.description && (
                  <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">
                    {location.description}
                  </p>
                )}

                {/* CAPACIDADE */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-line">
                  <span className="text-text-secondary text-sm">Capacidade</span>
                  <span className="bg-purple-secondary text-white px-4 py-1 rounded-full font-semibold">
                    {location.max_people}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex w-full justify-between gap-2 items-center mt-2">
          <p className="text-text-secondary">
            Você não possui locais cadastrados.
          </p>

          <button
            className="btn-green"
            onClick={() => navigate("/locale/create")}
          >
            Cadastrar Local
          </button>
        </div>
      )}
    </div>
  )
}

export default List
