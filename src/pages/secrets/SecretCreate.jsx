import { useAuth } from "../../contexts/AuthContext"
import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../services/api"
import DashboardLayout from "../global/dashboardLayout"

function SecretCreate() {
    const { logout, getToken } = useAuth()
    const navigate = useNavigate();
    const nameRef = useRef()
    const descriptionRef = useRef()
    const valueRef = useRef()
    const groupRef = useRef();
    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        try {
            const token = getToken()
            if (!token) {
                logout()
                navigate('/login')
                return
            }

            const response = await api.get("/groups", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setGroups(response.data.data);

        } catch (error) {
            if (error.response?.status === 401) {
                logout()
                navigate('/login')
            } else {
                toast.error(error.response.data.message)
            }
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const token = getToken()
            if (!token) {
                logout()
                navigate('/login')
                return
            }
            const { data } = await api.post('/secrets',
                {
                    id_group: groupRef.current.value,
                    name: nameRef.current.value,
                    value: valueRef.current.value,
                    description: descriptionRef.current.value
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(data.message)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else if (error.request) {
                toast.error('Connection error. Check your internet.')
            } else {
                toast.error('Unexpected error')
            }
        }
        navigate("/")
    }

    return (
        <DashboardLayout>
            <div className="mt-10 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-bg-secondary p-8 rounded-lg sh border border-line">
                        <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">New Secret</h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                ref={nameRef}
                                className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary"
                                type="text"
                                placeholder="Name"
                                required
                            />
                            <input
                                ref={valueRef}
                                className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary"
                                type="text"
                                placeholder="Value"
                            />
                            <select ref={groupRef} className="w-full px-3 py-3 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary">
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                ref={descriptionRef}
                                className="w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary"
                                type="text"
                                placeholder="Description (Optional)"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit" className="w-full bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer">
                                    Create
                                </button>
                                <button className="w-full bg-bg-secondary border border-line text-red-400 py-2 px-4 rounded-md cursor-pointer hover:bg-bg-secondary-hover" onClick={() => navigate("/")}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default SecretCreate