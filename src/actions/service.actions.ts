"use server"

import { ServiceSchema } from "../lib/formSchema";
import prisma from "../lib/prisma";

type CurrentState = { success: boolean; error: string | null };

export const createService = async (currentState: CurrentState, data: ServiceSchema) => {
    try {
        await prisma.servicio.create({
            data: {
                nombre_servicio: data.nombre_servicio,
                descripcion: data.descripcion,
                tarifa: data.tarifa,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al crear un servicio" };
    }
};

export const updateService = async (currentState: CurrentState, data: ServiceSchema) => {
    try {
        await prisma.servicio.update({
            where: { id_servicio: data.id_servicio! },
            data: {
                nombre_servicio: data.nombre_servicio,
                descripcion: data.descripcion,
                tarifa: data.tarifa,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al actualizar un servicio" };
    }
};

export const deleteService = async (
    data: FormData
) => {
    const id = data.get("id") as string;
    const serviceId = parseInt(id, 10);
    if (isNaN(serviceId)) {
        throw new Error("ID de servicio inválido");
    }
    try {
        await prisma.servicio.update({
            where: { id_servicio: serviceId },
            data: { deletedAt: new Date() },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al eliminar el servicio" };
    }
};









