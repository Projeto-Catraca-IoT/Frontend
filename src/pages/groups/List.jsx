import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { toast } from "react-toastify"

function List() {
  const { logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [allGroups, setAllGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadGroups = async (filter = "") => {
    try {
      setLoading(true)
      setError(null)

      const token = getToken()
      if (!token) {
        logout()
        navigate('/login')
        return
      }

      const url = filter ? `/groups?filter=${encodeURIComponent(filter)}` : "/groups/"

      const { data } = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data && data.data) {
        setAllGroups(data.data)
      } else {
        setAllGroups([])
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      } else if (error.response?.status !== 404) {
        setError(true)
        toast.error(error.message)
      } else {
        setAllGroups([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadGroups(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  if (loading) {
    return <div className="flex justify-center items-center h-60 w-full"><span className="text-text-secondary">Carregando grupos...</span></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-60 w-full">
        <span className="text-red-500 mb-2">Erro ao buscar grupos</span>
        <button className="mt-2 px-4 py-2 bg-purple-primary text-white rounded-md" onClick={() => loadGroups(searchTerm)}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:w-2/7 items-start justify-start mt-1 p-1 rounded">
      <div className="flex justify-between items-center w-full px-1">
        <h2 className="text-2xl font-bold text-text-primary hover:cursor-pointer" onClick={() => navigate('/')}>
          Groups
        </h2>

        <button
          className="md:hidden p-1 hover:bg-bg-secondary-hover rounded-lg transition-colors hover:cursor-pointer border border-line"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {error && (
        <p className="mt-2 text-text-secondary">Error to found groups</p>
      )}

      {!error && (
        <div className={`rounded-md p-1 w-full mt-1 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <div className="w-full mb-1">
            <input
              className="bg-bg-secondary border border-line p-1 sm:p-2 md:p-2.5 rounded-lg w-full text-sm md:text-base text-text-primary placeholder-gray-500 focus:border-purple-500/60 focus:outline-none transition-colors"
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {allGroups && allGroups.length > 0 ? (
            <ul className="space-y-1">
              {allGroups.map((group) => (
                <li
                  key={group.id}
                  className="relative bg-bg-secondary border border-line p-4 rounded-lg border-l hover:bg-bg-secondary-hover cursor-pointer transition-colors"
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-text-primary font-medium mb-1">{group.name}</p>
                      <p className="text-text-secondary text-sm">{group.description}</p>
                    </div>
                    <div className="bg-purple-secondary text-text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {group.secretsCount}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col w-full h-80 justify-start gap-1 items-start">
              <p className="text-text-secondary">
                {searchTerm ? "No groups found" : "No groups yet"}
              </p>
              {!searchTerm && (
                <button
                  className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-2 py-1 rounded-lg text-purple-primary transition-all cursor-pointer font-medium"
                  onClick={() => navigate("/group/create")}
                >
                  New Group
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default List