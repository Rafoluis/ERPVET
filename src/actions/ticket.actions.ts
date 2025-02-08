"use server";

import prisma from "../lib/prisma";
import { TicketSchema } from "@/lib/formSchema";

type CurrentState = { success: boolean; error: string | null };

export const createTicket = async (
    currentState: CurrentState,
    data: TicketSchema
): Promise<CurrentState> => {
    try {
        await prisma.ticket.create({
            data: {
                id_paciente: data.id_paciente,
                fecha_emision: new Date(),
                tipo_comprobante: data.tipo_comprobante,
                medio_pago: data.medio_pago,
                monto_total: data.monto_total,
                pagos: data.pagos
                    ? {
                        create: data.pagos.map((pago) => ({
                            ...pago,
                            fecha_pago: new Date(),
                            fecha_creacion: new Date(),
                        })),
                    }
                    : undefined,
            },
        });
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
            where: {
                id_ticket: data.id_ticket as number,
            },
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
            },
        });
        return { success: true, error: null };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Error al actualizar el ticket" };
    }
};

export const deleteTicket = async (
    currentState: CurrentState,
    data: FormData
): Promise<CurrentState> => {
    const id = data.get("id") as string;
    const ticketId = parseInt(id);
    try {
        await prisma.$transaction([
            prisma.pago.deleteMany({
                where: { id_ticket: ticketId },
            }),
            prisma.ticket.delete({
                where: { id_ticket: ticketId },
            }),
        ]);
        return { success: true, error: null };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Error al eliminar el ticket" };
    }
};