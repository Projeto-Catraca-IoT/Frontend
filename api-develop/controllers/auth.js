import { register as registerService, login as loginService, locations as locationsService } from '../services/auth.js';

//Registro
export const register = (request, response) => {
    try {
        registerService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar registrar usuário" });
    }
};

//Login
export const login = (request, response) => {
    try {
        loginService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar logar" })
    }
}

export const locations = (request, response) => {
    try {
        locationsService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao recuperar locais" })
    }
}
