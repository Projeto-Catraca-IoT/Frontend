import prisma from '../config/database.js';

async function valid_operation(auth_user_id, location_id) {
    const location = await prisma.location.findUnique({
        where: { id: location_id },
    });

    if (auth_user_id == location.userId) {
        return true
    } else {
        return false
    }
}

export const historyLocal = async (request, response) => {
    try {
        const userId = request.authId;
        const location_id = Number(request.params.id);

        if (await valid_operation(userId, location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        const history = await prisma.History.findMany({
            where: {
                gate: {
                    location_id: location_id
                }
            }
        });

        return response.status(200).json({
            message: "Histórico recuperado com sucesso",
            data: history
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao buscar histórico' });
    }
}

export const historyGate = async (request, response) => {
    try {
        const gate_id = Number(request.params.id);

        const gate = await prisma.Gate.findUnique({
            where: { id: Number(request.params.id) },
        });

        const gate_location_id = gate.location_id;

        if (await valid_operation(request.authId, gate_location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        const history = await prisma.History.findMany({
            where: { gate_id: gate_id }
        });

        return response.status(200).json({ mesage: "Movimento recuperado com sucesso", data: history });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao buscar histórico' });
    }
}