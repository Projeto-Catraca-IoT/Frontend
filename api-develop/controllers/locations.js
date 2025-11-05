import { locationsAll as locationsAllService, locationsCreate as locationsCreateService, locationsInfo as locationsInfoService, locationsDelete as locationsDeleteService } from '../services/locations.js';

//Recuperar todos os locais
export const locationsAll = (request, response) => {
    try {
        locationsAllService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar recuperar locais" });
    }
};

//Criar local
export const locationsCreate = (request, response) => {
    try {
        locationsCreateService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar criar local" })
    }
}

//Info de um local específico
export const locationsInfo = (request, response) => {
    try {
        locationsInfoService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao recuperar informação do local" })
    }
}

//Editar um local específico
export const locationsEdit = (request, response) => {
    try {
        locationsEditService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar editar local" })
    }
}

//Apagar um local específico
export const locationsDelete = (request, response) => {
    try {
        locationsDeleteService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar apagar local" })
    }
}