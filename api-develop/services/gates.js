import prisma from '../config/database.js';
import crypto from 'crypto';

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

export const gates = async (request, response) => {
    try {
        const location_id = Number(request.params.id);

        if (await valid_operation(request.authId, location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }


        const gates = await prisma.Gate.findMany({
            where: { location_id: location_id },
        });

        return response.status(200).json({ data: gates });

    } catch (error) {
        return response.status(500).json({ message: 'Erro ao buscar por catracas' });
    }
}

export const gatesCreate = async (request, response) => {
    try {
        const { tag, status, location_id } = request.body;

        if (await valid_operation(request.authId, location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        const new_gate = await prisma.Gate.create({
            data: {
                tag: tag,
                status: status,
                location_id: location_id
            }
        });

        return response.status(201).json({ mesage: "Catraca criada com sucesso", data: new_gate });

    } catch (error) {
        console.log(error)
        return response.status(500).json({ message: 'Erro ao criar catraca' });
    }
}

export const gatesInfo = async (request, response) => {
    try {
        const gate = await prisma.Gate.findUnique({
            where: { id: Number(request.params.id) },
        });

        if (await valid_operation(request.authId, gate.location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        return response.status(200).json({ data: gate });

    } catch (error) {
        return response.status(500).json({ message: 'Erro ao buscar por catraca' });
    }
}

export const gatesEdit = async (request, response) => {
    try {
        const { tag, status, location_id } = request.body;

        const gate = await prisma.Gate.findUnique({
            where: { id: Number(request.params.id) },
        });

        if (await valid_operation(request.authId, gate.location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        if (location_id) {
            return response.status(400).json({ message: "Você não pode editar o local da catraca" });
        }

        if (!tag && !status) {
            return response.status(400).json({ message: "Envie ao menos um campo para ser editado" });
        }

        const editedGate = await prisma.Gate.update({
            where: { id: Number(request.params.id) },
            data: { tag, status }
        });

        return response.status(200).json({ mesage: "Catraca editada com sucesso", data: editedGate });
    } catch (error) {
        return response.status(500).json({ message: 'Erro ao editar catraca' });
    }
}

export const gatesDelete = async (request, response) => {
    try {
        const gate = await prisma.Gate.findUnique({
            where: { id: Number(request.params.id) },
        });

        if (await valid_operation(request.authId, gate.location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        const removed_gate = await prisma.Gate.delete({
            where: { id: Number(request.params.id) }
        });

        return response.status(200).json({ mesage: "Catraca apagada com sucesso" });

    } catch (error) {
        return response.status(500).json({ message: 'Erro ao apagar catraca' });
    }
}

export const gatesMovement = async (request, response) => {
    try {

        const gate_id = Number(request.params.id);

        const { operation } = request.body;

        const gate = await prisma.Gate.findUnique({
            where: { id: Number(request.params.id) },
        });

        const gate_location_id = gate.location_id;

        if (await valid_operation(request.authId, gate_location_id) == false) {
            return response.status(401).json({ message: 'Sem autorização para isso' });
        }

        const history = await prisma.History.create({
            data: {
                gate_id,
                operation,
            },
        });

        if (operation == "entrada") {
            await prisma.Location.update({
                where: { id: gate.location_id },
                data: { current_people: { increment: 1 } }
            });
        } else if (operation == "saida") {
            await prisma.Location.update({
                where: { id: gate.location_id },
                data: { current_people: { decrement: 1 } }
            });
        }

        return response.status(201).json({ mesage: "Movimento criado com sucesso com sucesso", data: history });

    } catch (error) {
        console.error('Erro ao registrar movimento:', error);
        throw error;
    }
}