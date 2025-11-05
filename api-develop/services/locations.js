import crypto from 'crypto';
import prisma from '../config/database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const locationsAll = async (request, response) => {
    try {
        const userLocations = await prisma.Location.findMany({});

        return response.status(200).json({ data: userLocations });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao buscar por locais' });
    }
}

export const locationsCreate = async (request, response) => {
    try {
        const { name, max_people, address, description } = request.body;

        // verificação de dados válidos
        if (!name || !max_people || !address) {
            return response.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const editedLocation = await prisma.Location.create({
            data: {
                name: name,
                address: address,
                max_people: max_people,
                description: description,
                userId: request.authId
            }
        });

        response.status(201).json({ message: "Local criado com sucesso", data: editedLocation });


    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Erro ao criar local' });
    }
}

export const locationsInfo = async (request, response) => {
    try {
        const userId = request.authId; // Pega do middleware

        const userLocations = await prisma.Location.findMany({
            where: {
                userId: userId
            }
        });

        return response.status(200).json({ data: userLocations });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao buscar por locais' });
    }
}

export const locationsEdit = async (request, response) => {
    try {

        const location_id = Number(request.params.id);

        const location = await prisma.location.findUnique({
            where: { id: location_id },
        });

        const { name, max_people, address, description, logo_image, google_maps_url } = request.body;

        if (!name && !max_people && !address && !description && !logo_image && !google_maps_url) {
            return response.status(400).json({ message: "Envie ao menos um campo para ser editado" });
        }

        if (location.userId != request.authId) {
            return response.status(400).json({ message: "Sem autorização para essa ação" });
        }

        const editedLocation = await prisma.Location.update({
            where: { id: location_id },
            data: { name, max_people, address, description, logo_image, google_maps_url }
        });

        response.status(200).json({ message: "Local atualizado com sucesso", data: editedLocation });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao atualizar local' });
    }
}

export const locationsDelete = async (request, response) => {
    try {

        const location_id = Number(request.params.id);

        const location = await prisma.location.findUnique({
            where: { id: location_id },
        });

        if (location.userId != request.authId) {
            return response.status(400).json({ message: "Sem autorização para essa ação" });
        }

        const remove_location = await prisma.Location.delete({
            where: { id: location_id }
        });

        response.status(200).json({ message: "Local deletado com sucesso" });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao deletar local' });
    }
}