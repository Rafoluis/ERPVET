"use server"

import { revalidatePath } from "next/cache";
import { AppointmentSchema } from "./formSchema"
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean }

export const createAppointment = async (currentState: CurrentState, data: AppointmentSchema) => {
    try {

        await prisma.cita.create({
            data: {
                id_paciente: data.id_paciente,
                fecha_cita: data.fecha_cita,
                hora_cita_inicial: data.hora_cita_inicial,
                hora_cita_final: data.hora_cita_final,
                id_servicio: data.id_servicio,
                id_empleado: data.id_empleado,
                estado: data.estado,
            }
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
                id_paciente: data.id_paciente,
                fecha_cita: data.fecha_cita,
                hora_cita_inicial: data.hora_cita_inicial,
                hora_cita_final: data.hora_cita_final,
                id_servicio: data.id_servicio,
                id_empleado: data.id_empleado,
                estado: data.estado,
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