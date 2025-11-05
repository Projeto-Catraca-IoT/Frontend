import { historyLocal as historyLocalService, historyGate as historyGateService } from '../services/history.js';

//local
export const historyLocal = (request, response) => {
    try {
        historyLocalService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao buscar histórico" });
    }
};

//catraca
export const historyGate = (request, response) => {
    try {
        historyGateService(request, response);
    } catch (error) {
        response.status(500).json({ message: "Erro inesperado ao buscar histórico" })
    }
}
