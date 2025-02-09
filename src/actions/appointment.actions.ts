"use server";

import { AppointmentSchema } from "../lib/formSchema";
import prisma from "../lib/prisma";

type CurrentState = { success: boolean; error: string | null };

const processAppointment = async (
    currentState: CurrentState,
    data: AppointmentSchema,
    isUpdate = false
) => {
    try {
        // Convertir fechas y horas a UTC y ajustar zona horaria
        const horaFinalUTC = data.hora_cita_final ? new Date(data.hora_cita_final) : undefined;
        const fechaCitaUTC = new Date(data.fecha_cita);
        const options = { timeZone: "America/Lima", hour12: false };
        const horaFinal = horaFinalUTC
            ? new Date(horaFinalUTC.toLocaleString("en-US", options))
            : undefined;
        const fechaCita = new Date(fechaCitaUTC.getTime() - fechaCitaUTC.getTimezoneOffset() * 60000);

        if (horaFinal && horaFinal <= fechaCita) {
            return { success: false, error: "La hora final debe ser después de la hora de inicio" };
        }

        const exclusionCondition = isUpdate && data.id_cita ? { NOT: { id_cita: data.id_cita } } : {};

        const overlappingCitas = await prisma.cita.findMany({
            where: {
                id_empleado: data.id_empleado,
                estado: { in: ["AGENDADO", "EN_PROCESO"] },
                ...exclusionCondition,
                AND: [
                    {
                        OR: [
                            { hora_cita_inicial: { lte: fechaCita }, hora_cita_final: { gte: fechaCita } },
                            { hora_cita_inicial: { lte: horaFinal }, hora_cita_final: { gte: horaFinal } },
                            { hora_cita_inicial: { gte: fechaCita }, hora_cita_final: { lte: horaFinal } },
                            { hora_cita_inicial: { lte: fechaCita }, hora_cita_final: { gte: horaFinal } },
                        ],
                    },
                ],
            },
        });

        if (overlappingCitas.length > 0) {
            return { success: false, error: "El odontólogo ya tiene una cita en este horario." };
        }

        // Procesar la entrada de servicios (ya sea un string JSON o array)
        let serviciosData: { id_servicio: number; cantidad: number }[] = [];
        if (typeof data.servicios === "string") {
            try {
                const parsed = JSON.parse(data.servicios);
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "number") {
                    serviciosData = (parsed as unknown as number[]).map((id) => ({ id_servicio: id, cantidad: 1 }));
                } else {
                    serviciosData = parsed;
                }
            } catch (err) {
                serviciosData = [];
            }
        } else if (Array.isArray(data.servicios)) {
            if (data.servicios.length > 0 && typeof data.servicios[0] === "number") {
                serviciosData = (data.servicios as unknown as number[]).map((id) => ({ id_servicio: id, cantidad: 1 }));
            } else {
                serviciosData = data.servicios as { id_servicio: number; cantidad: number }[];
            }
        }

        // Si hay servicios, obtener las tarifas para calcular el total de la cita.
        let totalCost = 0;
        if (serviciosData.length > 0) {
            const serviceIds = serviciosData.map((s) => s.id_servicio);
            const services = await prisma.servicio.findMany({
                where: { id_servicio: { in: serviceIds } },
                select: { id_servicio: true, tarifa: true },
            });
            // Crear un mapa: id_servicio -> tarifa
            const tarifaMap = new Map<number, number>();
            for (const service of services) {
                tarifaMap.set(service.id_servicio, service.tarifa);
            }
            totalCost = serviciosData.reduce((acc, serv) => {
                const tarifa = tarifaMap.get(serv.id_servicio) || 0;
                return acc + tarifa * serv.cantidad;
            }, 0);
        }

        if (isUpdate) {
            if (!data.id_cita) {
                return { success: false, error: "ID Obligatorio" };
            }
            // Obtener la cita actual para conocer el monto pagado
            const currentCita = await prisma.cita.findUnique({
                where: { id_cita: data.id_cita },
                select: { monto_pagado: true },
            });
            const currentMontoPagado = currentCita?.monto_pagado || 0;
            // Nuevo valor de deuda = total de servicios - monto ya pagado
            let newDebt = totalCost - currentMontoPagado;
            if (newDebt < 0) newDebt = 0;

            const updatePayload = {
                id_paciente: data.id_paciente,
                fecha_cita: fechaCita,
                hora_cita_inicial: fechaCita,
                hora_cita_final: horaFinal,
                id_empleado: data.id_empleado,
                estado: data.estado,
                deuda_restante: newDebt,
                // No modificamos monto_pagado aquí, ya que puede tener pagos registrados
            };

            console.log("Update payload:", updatePayload);

            await prisma.cita.update({
                where: { id_cita: data.id_cita },
                data: updatePayload,
            });

            const newServiceIds = serviciosData.map((serv) => serv.id_servicio);
            if (newServiceIds.length > 0) {
                await prisma.servicioCita.deleteMany({
                    where: {
                        id_cita: data.id_cita,
                        id_servicio: { notIn: newServiceIds },
                    },
                });
            } else {
                await prisma.servicioCita.deleteMany({
                    where: { id_cita: data.id_cita },
                });
            }
            for (const serv of serviciosData) {
                console.log("Procesando servicio:", serv);
                await prisma.servicioCita.upsert({
                    where: {
                        id_cita_id_servicio: {
                            id_cita: data.id_cita!,
                            id_servicio: serv.id_servicio,
                        },
                    },
                    update: { cantidad: serv.cantidad },
                    create: {
                        id_cita: data.id_cita!,
                        id_servicio: serv.id_servicio,
                        cantidad: serv.cantidad,
                    },
                });
            }
        } else {
            await prisma.cita.create({
                data: {
                    id_paciente: data.id_paciente,
                    fecha_cita: fechaCita,
                    hora_cita_inicial: fechaCita,
                    hora_cita_final: horaFinal,
                    id_empleado: data.id_empleado,
                    estado: data.estado,
                    monto_pagado: 0,
                    deuda_restante: totalCost, // Inicialmente la deuda es igual al total de la cita
                    servicios:
                        serviciosData.length > 0
                            ? {
                                create: serviciosData.map((serv) => ({
                                    servicio: { connect: { id_servicio: serv.id_servicio } },
                                    cantidad: serv.cantidad,
                                })),
                            }
                            : undefined,
                },
            });
        }
        return { success: true, error: null };
    } catch (err) {
        console.error("Error al procesar la cita:", err);
        return {
            success: false,
            error: `Ocurrió un error al procesar la cita: ${(err as Error).message || err}`,
        };
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
        await prisma.servicioCita.deleteMany({
            where: { id_cita: parseInt(id) },
        });
        await prisma.cita.delete({
            where: { id_cita: parseInt(id) },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: null };
    }
};
