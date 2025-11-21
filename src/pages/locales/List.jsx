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

      if (data && data.data && data.data.length > 0) {
        setLocations(data.data)
      } else {
        setLocations([])
      }
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
    <div className="flex flex-col items-start justify-start mt-1 p-1 rounded">
      {locations.length > 0 ? (
        <>
          <div className="flex w-full justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Seus locais cadastrados</h2>
            <button
              className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-4 py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
              onClick={() => navigate("/locale/create")}
            >
              Cadastrar Local
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-bg-secondary border border-line rounded-lg hover:bg-bg-secondary-hover hover:border-purple-primary cursor-pointer transition-all p-4"
                onClick={() => navigate(`/locale/${location.id}`)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-text-primary font-semibold text-lg mb-2 truncate">
                      {location.name}
                    </h3>

                    {location.description && (
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {location.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary text-sm">
                        Capacidade:
                      </span>
                    </div>
                    <span className="bg-purple-primary text-text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {location.max_people}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex w-full justify-between gap-1 items-center m-2">
          <p className="text-text-secondary">Você não possui locais cadastrados</p>
          <button
            className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-2 py-1 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
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