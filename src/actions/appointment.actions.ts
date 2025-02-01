"use server"

import { AppointmentSchema } from "../lib/formSchema"
import prisma from "../lib/prisma";

type CurrentState = { success: boolean; error: string | null };
type Response = { success: boolean; error: string | null };

const processAppointment = async (currentState: CurrentState, data: AppointmentSchema, isUpdate = false) => {
    try {
        const horaFinalUTC = data.hora_cita_final ? new Date(data.hora_cita_final) : undefined;
        const fechaCitaUTC = new Date(data.fecha_cita);
        const options = { timeZone: 'America/Lima', hour12: false };
        const horaFinal = horaFinalUTC ? new Date(horaFinalUTC.toLocaleString('en-US', options)) : undefined;
        const fechaCita = new Date(fechaCitaUTC.getTime() - fechaCitaUTC.getTimezoneOffset() * 60000);

        if (horaFinal && horaFinal <= fechaCita) {
            return { success: false, error: "La hora final debe ser después de la hora de inicio" };
        }

        // Excluir la cita actual en modo actualización
        const exclusionCondition = isUpdate && data.id_cita ? { NOT: { id_cita: data.id_cita } } : {};

        const overlappingCitas = await prisma.cita.findMany({
            where: {
                id_empleado: data.id_empleado,
                estado: { in: ["AGENDADO", "EN_PROCESO"] },
                ...exclusionCondition,
                AND: [
                    {
                        OR: [
                            {
                                hora_cita_inicial: { lte: fechaCita },
                                hora_cita_final: { gte: fechaCita },
                            },
                            {
                                hora_cita_inicial: { lte: horaFinal },
                                hora_cita_final: { gte: horaFinal },
                            },
                            {
                                hora_cita_inicial: { gte: fechaCita },
                                hora_cita_final: { lte: horaFinal },
                            },
                            {
                                hora_cita_inicial: { lte: fechaCita },
                                hora_cita_final: { gte: horaFinal },
                            },
                        ],
                    },
                ],
            },
        });

        if (overlappingCitas.length > 0) {
            return { success: false, error: "El odontólogo ya tiene una cita en este horario." };
        }

        if (isUpdate) {
            await prisma.cita.update({
                where: { id_cita: data.id_cita },
                data: {
                    id_paciente: data.id_paciente,
                    fecha_cita: data.fecha_cita,
                    hora_cita_inicial: fechaCita,
                    hora_cita_final: horaFinal,
                    id_servicio: data.id_servicio,
                    id_empleado: data.id_empleado,
                    estado: data.estado,
                },
            });
        } else {
            await prisma.cita.create({
                data: {
                    id_paciente: data.id_paciente,
                    fecha_cita: data.fecha_cita,
                    hora_cita_inicial: fechaCita,
                    hora_cita_final: horaFinal,
                    id_servicio: data.id_servicio,
                    id_empleado: data.id_empleado,
                    estado: data.estado,
                },
            });
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("Error al procesar la cita:", err);
        return { success: false, error: `Ocurrió un error al procesar la cita: ${(err as Error).message || err}` };
    }
};

export const createAppointment = async (currentState: CurrentState, data: AppointmentSchema) => {
    return processAppointment(currentState, data, false);
};

export const updateAppointment = async (currentState: CurrentState, data: AppointmentSchema) => {
    return processAppointment(currentState, data, true);
};

export const deleteAppointment = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string;
    try {
        await prisma.cita.delete({
            where: {
                id_cita: parseInt(id),
            },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error('Se produjo un error desconocido:', err);
        }
        return { success: false, error: null };
    }
}