"use server"

import { revalidatePath } from "next/cache";
import { AppointmentSchema } from "./formSchema"
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean }

export const createAppointment = async (currentState: CurrentState, data: AppointmentSchema) => {
    try {
        await prisma.cita.create({
            data: {
                fecha_cita: new Date(data.date),
                hora_cita_inicial: new Date(data.date),
                hora_cita_final: new Date(data.date),
                estado: "AGENDADO"
            },
        });

        //revalidatePath("/list/appointments");
        return { success: true, error: false };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error('Se produjo un error desconocido:', err);
        }
        return { success: false, error: true };
    }
}

export const updateAppointment = async (currentState: CurrentState, data: AppointmentSchema) => {
    try {
        await prisma.cita.update({
            where: {
                id_cita: data.id
            },
            data: {
                fecha_cita: new Date(data.date),
                hora_cita_inicial: new Date(data.date),
                hora_cita_final: new Date(data.date),
                estado: "AGENDADO"
            },
        });

        //revalidatePath("/list/appointments");
        return { success: true, error: false };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error('Se produjo un error desconocido:', err);
        }
        return { success: false, error: true };
    }
}

export const deleteAppointment = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string;
    try {
        await prisma.cita.delete({
            where: {
                id_cita: parseInt(id),
            },
        });

        //revalidatePath("/list/appointments");
        return { success: true, error: false };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error('Se produjo un error desconocido:', err);
        }
        return { success: false, error: true };
    }
}