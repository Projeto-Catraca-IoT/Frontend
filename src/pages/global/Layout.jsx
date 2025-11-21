import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

function Layout({ children, noWrapper = false }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-bg text-text-secondary flex flex-col">

            {/* HEADER */}
            <header className="flex justify-between items-center mx-10 mt-7 bg-purple-secondary 
                               p-4 rounded-xl shadow-md border border-line/30">
                
                <h1 
                    onClick={() => navigate('/')}
                    className="cursor-pointer text-3xl font-extrabold tracking-wide"
                >
                    <span className="text-text-primary">Smart</span>
                    <span className="text-green-logo">Gate</span>
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-bg-secondary border border-line p-2 rounded-full 
                               hover:bg-bg-secondary-hover transition-all shadow-sm hover:shadow-md"
                >
                    <LogOut className="w-5 h-5 text-text-primary" />
                </button>
            </header>

            {/* MAIN CONTENT */}
            {noWrapper ? (
                <main className="flex-1 m-10">{children}</main>
            ) : (
                <main className="flex-1 p-6 bg-bg-secondary border border-line rounded-xl m-10 shadow-lg">
                    {children}
                </main>
            )}

            {/* FOOTER */}
            <footer className="text-text-secondary text-center pb-6">
                <p className="text-sm">
                    Desenvolvido por{" "}
                    <a
                        className="underline transition-opacity hover:opacity-70"
                        target="_blank"
                        href="https://github.com/Projeto-Catraca-IoT"
                    >
                        equipe Smart Gate
                    </a>
                </p>
            </footer>
        </div>
    )
}

export default Layout
