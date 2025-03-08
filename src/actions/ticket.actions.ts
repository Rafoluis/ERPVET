"use server";

import prisma from "../lib/prisma";
import { TicketSchema } from "@/lib/formSchema";

type CurrentState = { success: boolean; error: string | null };

export const createTicket = async (
    currentState: CurrentState,
    data: TicketSchema
): Promise<CurrentState> => {
    try {
        const citaIds: number[] = data.citas || [];
        const citasSeleccionadas = await prisma.cita.findMany({
            where: { id_cita: { in: citaIds } },
            include: {
                servicios: {
                    include: {
                        servicio: true,
                    },
                },
            },
        });

        const citasOrdenadas = citasSeleccionadas.sort(
            (a, b) => new Date(a.fecha_cita).getTime() - new Date(b.fecha_cita).getTime()
        );

        const totalCitasCost = citasOrdenadas.reduce((sum, cita) => {
            const costoCita = cita.servicios.reduce(
                (acc, s) => acc + s.cantidad * s.servicio.tarifa,
                0
            );
            return sum + costoCita;
        }, 0);

        const paymentAmount = data.fraccionar_pago ? (data.monto_parcial || 0) : totalCitasCost;

        let remainingPayment = paymentAmount;
        const citaUpdates = [];

        for (const cita of citasOrdenadas) {
            const costoCita = cita.servicios.reduce(
                (acc, s) => acc + s.cantidad * s.servicio.tarifa,
                0
            );

            if (remainingPayment >= costoCita) {
                citaUpdates.push(
                    prisma.cita.update({
                        where: { id_cita: cita.id_cita },
                        data: {
                            monto_pagado: costoCita,
                            deuda_restante: 0,
                        },
                    })
                );
                remainingPayment -= costoCita;
            } else if (remainingPayment > 0) {
                citaUpdates.push(
                    prisma.cita.update({
                        where: { id_cita: cita.id_cita },
                        data: {
                            monto_pagado: remainingPayment,
                            deuda_restante: costoCita - remainingPayment,
                        },
                    })
                );
                remainingPayment = 0;
            }
        }

        const ticketMontoPagado = paymentAmount;
        const ticketDeudaRestante = totalCitasCost - paymentAmount;

        await prisma.$transaction([
            prisma.ticket.create({
                data: {
                    id_paciente: data.id_paciente,
                    fecha_emision: new Date(),
                    tipo_comprobante: data.tipo_comprobante,
                    medio_pago: data.medio_pago,
                    monto_total: totalCitasCost,
                    monto_pagado: ticketMontoPagado,
                    deuda_restante: ticketDeudaRestante,
                    pagos: data.pagos
                        ? {
                            create: data.pagos.map((pago) => ({
                                ...pago,
                                fecha_pago: new Date(),
                                fecha_creacion: new Date(),
                            })),
                        }
                        : undefined,
                    ticketCitas:
                        data.citas && data.citas.length > 0
                            ? {
                                create: data.citas.map((id_cita: number) => ({
                                    id_cita,
                                })),
                            }
                            : undefined,
                },
            }),
            ...citaUpdates,
        ]);

        return { success: true, error: null };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Error al crear el ticket" };
    }
};

export const updateTicket = async (
    currentState: CurrentState,
    data: TicketSchema
): Promise<CurrentState> => {
    try {
        await prisma.ticket.update({
            where: { id_ticket: data.id_ticket as number },
            data: {
                id_paciente: data.id_paciente,
                fecha_emision: new Date(),
                tipo_comprobante: data.tipo_comprobante,
                medio_pago: data.medio_pago,
                monto_total: data.monto_total,
                pagos: data.pagos
                    ? {
                        deleteMany: {},
                        create: data.pagos.map((pago) => ({
                            ...pago,
                            fecha_pago: new Date(),
                            fecha_creacion: new Date(),
                        })),
                    }
                    : undefined,
                ticketCitas: data.citas
                    ? {
                        deleteMany: {},
                        create: data.citas.map((id_cita: number) => ({
                            id_cita,
                        })),
                    }
                    : undefined,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Error al actualizar el ticket" };
    }
};

export const deleteTicket = async (
    data: FormData
): Promise<CurrentState> => {
    const idValue = data.get("id") as string;
    if (!idValue) {
        return { success: false, error: "ID no proporcionado" };
    }
    const ticketId = parseInt(idValue, 10);
    if (isNaN(ticketId)) {
        return { success: false, error: "Ticket ID no válido" };
    }
    try {
        await prisma.$transaction([
            prisma.pago.updateMany({
                where: { id_ticket: ticketId },
                data: { deletedAt: new Date() },
            }),
            prisma.ticket.update({
                where: { id_ticket: ticketId },
                data: { deletedAt: new Date() },
            }),
        ]);
        return { success: true, error: null };
    } catch (err) {
        console.error(String(err));
        return { success: false, error: "Error al eliminar el ticket" };
    }
};

