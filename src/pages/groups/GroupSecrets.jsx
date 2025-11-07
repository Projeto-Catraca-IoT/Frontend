import React from 'react'
import { toast } from "react-toastify"
import { useParams } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import DashboardLayout from '../global/dashboardLayout'
import api from "../../services/api"
import { useEffect, useState } from 'react'
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Modal from "../../components/ModalDelete"
import ModalEdit from './ModalEdit'

function GroupSecrets() {
  const { id } = useParams()
  const { logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [group, setGroup] = useState([])
  const [allSecrets, setAllSecrets] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true);

  // Group delete
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const deleteGroup = async () => {
    try {
      setError(null)

      const token = getToken()
      if (!token) {
        logout()
        navigate('/login')
        return
      }

      const { data } = await api.delete(`/groups/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(data.message)
      navigate("/")

    } catch (error) {
      setError(true)
      if (error.response) {
        toast.error(error.response.data?.message || 'Error to delete group')
      }

      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      }
    } finally {
      setShowModal(false);
    }
  };

  // Group edit
  const [showModalEdit, setShowModalEdit] = useState(false);
  const openModalEdit = () => {
    setShowModalEdit(true);
  };
  const closeModalEdit = () => {
    setShowModalEdit(false);
  };
  const editGroup = async (formData) => {
    try {
      setError(null)
      const token = getToken()
      if (!token) {
        logout()
        navigate('/login')
        return
      }

      const { data } = await api.put(`/groups/${id}`, {
        name: formData.name,
        description: formData.description
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success(data.message)
      navigate("/")
    } catch (error) {
      setError(true)
      if (error.response) {
        toast.error(error.response.data?.message || 'Error to update group')
      }
      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      }
    } finally {
      setShowModalEdit(false);
    }
  };

  const loadSecrets = async () => {
    try {
      setError(null)
      setLoading(true)

      const token = getToken()
      if (!token) {
        logout()
        navigate('/login')
        return
      }

      const responseSecret = await api.get(`/groups/${id}/secrets`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAllSecrets(responseSecret.data.data)

      const responseGroup = await api.get(`/groups/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setGroup(responseGroup.data.data);


    } catch (error) {
      setError(true)
      if (error.response) {
        toast.error(error.response.data?.message || 'Error to find secrets')
      }

      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadSecrets()
    }
  }, [id])

  if (loading) {
    return <div className="flex justify-center items-center h-60 w-full"><span className="text-text-secondary">Carregando detalhes...</span></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-60 w-full">
        <span className="text-red-500 mb-2">Erro ao buscar detalhes</span>
        <button className="mt-2 px-4 py-2 bg-purple-primary text-white rounded-md" onClick={loadSecrets}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-start justify-start mt-1 p-1 rounded gap">
        <div className="flex items-center justify-between w-full mb-1">
          <div className='flex items-center gap-1'>
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-bg-secondary rounded-lg transition-colors group"
            >
              <ArrowLeft size={20} className="text-text-primary group-hover:cursor-pointer" />
            </button>
            <h2 className="text-2xl font-bold text-text-primary">Group details</h2>
          </div>
          <div className='flex gap-1 items-center'>
            <button className='bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-3 py-1.5 rounded-lg text-text-secondary transition-all cursor-pointer font-medium flex items-center justify-center' onClick={openModalEdit}>
              <Pencil className="w-4 h-4" />
            </button>
            <button className='bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-3 py-1.5 rounded-lg text-text-secondary transition-all cursor-pointer font-medium flex items-center justify-center' onClick={openModal}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border border-line rounded-md flex flex-col gap-2 p-1 w-full">
          <div className='flex gap-2 items-center'>
            <p className="w-20 text-right">Name:</p>
            <input
              type="text"
              disabled
              placeholder={group.name}
              className='bg-bg-secondary-hover p-1 text-text-primary border border-line rounded-md flex-1'
            />
          </div>

          <div className='flex gap-2 items-center'>
            <p className="w-20 text-right">Description:</p>
            <input
              type="text"
              disabled
              placeholder={group.description}
              className='bg-bg-secondary-hover p-1 text-text-primary border border-line rounded-md flex-1'
            />
          </div>

          <div className='flex gap-2 items-center'>
            <p className="w-20 text-right">Created:</p>
            <input
              type="text"
              disabled
              placeholder={dayjs(group.created_at).format("DD/MM/YYYY HH:mm")}
              className='text-text-primary'
            />
          </div>

          <div className='flex gap-2 items-center'>
            <p className="w-20 text-right">Updated:</p>
            <input
              type="text"
              disabled
              placeholder={dayjs(group.updated_at).format("DD/MM/YYYY HH:mm")}
              className='text-text-primary'
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-primary px-1 mt-3">Secrets</h2>

        {error && (
          <p className="mt-2 text-text-secondary">Error to found secrets</p>
        )}

        {!error && (
          <div className="rounded-md p-1 w-full">
            {allSecrets && allSecrets.length > 0 ? (
              <ul className="space-y-1">
                {allSecrets.map((secret) => (
                  <li key={secret.id} className="relative bg-bg-secondary border border-line p-4 rounded-lg border-l hover:bg-bg-secondary-hover cursor-pointer transition-colors" onClick={() => navigate(`/secret/${secret.id}`)}>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col items-start gap-3">
                        <p className="text-text-primary font-medium">{secret.name}</p>
                        <p className="text-text-secondary text-sm">{secret.description}</p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-sm text-text-secondary">Updated: {dayjs(secret.updated_at).format("DD/MM/YYYY HH:mm")}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='flex flex-col items-center w-full h-80 justify-center gap-1'>
                <img src="/disease.png" alt="Confused person" className='w-40' />
                <p className='text-text-secondary'>No secrets here</p>
                <button className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-2 py-1 rounded-lg text-purple-primary transition-all cursor-pointer font-medium" onClick={() => navigate("/secret/create")}>
                  New Secret
                </button>
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={closeModal}
          onExecute={deleteGroup}
          title="Confirm Deletion"
          description={`The group "${group.name}" will be permanently removed.`}
        />
        <ModalEdit
          isOpen={showModalEdit}
          onClose={closeModalEdit}
          onExecute={editGroup}
          data={group}
        />
      </div>
    </DashboardLayout>
  )
}

export default GroupSecrets