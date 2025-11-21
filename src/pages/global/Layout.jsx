import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

function Layout({ children }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-bg text-text-secondary flex flex-col">
            <div className="flex justify-between items-center mx-10 mt-7 bg-purple-secondary p-2 rounded-lg">
                <h1 onClick={() => navigate('/')} className="cursor-pointer text-2xl font-bold text-green-logo"><span className="text-text-primary">Smart</span>Gate</h1>
                <button
                    onClick={handleLogout}
                    className="bg-bg-secondary border border-line px-4 py-2 rounded-lg text-text-primary hover:bg-bg-secondary-hover cursor-pointer transition-all font-medium"
                >
                    <LogOut className="w-4 h-4"/>
                </button>
            </div>
            <main className="flex-1 p-6 bg-bg-secondary border border-line rounded-lg m-10 shadow-lg">
                {children}
            </main>
            <div className="text-text-secondary text-center pb-4">
                <p className="text-sm">Desenvolvido por <a className="underline" target="_blank" href="https://github.com/ViniciusCassemira">equipe Smart Gate</a></p>
            </div>
        </div>
    )
}

export default Layout