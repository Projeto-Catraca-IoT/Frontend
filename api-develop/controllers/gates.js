import { gates as gatesService, gatesCreate as gatesCreateService, gatesInfo as gatesInfoService, gatesEdit as gatesEditService, gatesDelete as gatesDeleteService, gatesMovement as gatesMovementService } from '../services/gates.js';

//Recuperar todos as catracas
export const gates = (request, response) => {
    try {
        gatesService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar recuperar catracas" });
    }
};

//Criar catraca
export const gatesCreate = (request, response) => {
    try {
        gatesCreateService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar criar catraca" })
    }
}

//Info de uma catraca específica
export const gatesInfo = (request, response) => {
    try {
        gatesInfoService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao recuperar informação da catraca" })
    }
}

//Editar uma catraca específica
export const gatesEdit = (request, response) => {
    try {
        gatesEditService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar editar catraca" })
    }
}

//Apagar uma catraca específica
export const gatesDelete = (request, response) => {
    try {
        gatesDeleteService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao tentar apagar catraca" })
    }
}

//Criar movimentação catraca
export const gatesMovement = (request, response) => {
    try {
        gatesMovementService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao criar movimentação para a catraca" })
    }
}

