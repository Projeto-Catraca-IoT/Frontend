import axios from '../api/axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function login(email, password) {
  const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
  return response.data;
}

export async function register(username, email, password) {
  const response = await axios.post(`${apiUrl}/auth/register`, { username, email, password });
  return response.data;
}

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

// Opcional: Função para verificar validade do token
export async function verifyToken() {
  const token = getToken();
  if (!token) return false;
  try {
    const response = await axios.get(`${apiUrl}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch {
    return false;
  }
}
