"use server"

import { revalidatePath } from "next/cache";
import { AppointmentSchema, PatientSchema } from "./formSchema"
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean }

export const createAppointment = async (currentState: CurrentState, data: AppointmentSchema) => {
    try {

        await prisma.cita.create({
            data: {
                id_paciente: data.id_paciente,
                fecha_cita: data.fecha_cita,
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
                id_cita: data.id_cita
            },
            data: {
                id_paciente: data.id_paciente,
                fecha_cita: data.fecha_cita,
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

export const createPatient = async (currentState: CurrentState, data: PatientSchema) => {
    try {

        await prisma.paciente.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                dni: data.dni,
                sexo: data.sexo,
                fecha_nacimiento: data.fecha_nacimiento,
                direccion: data.direccion,
                telefono: data.telefono,
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

export const updatePatient = async (currentState: CurrentState, data: PatientSchema) => {
    try {

        await prisma.paciente.update({
            where: {
                id_paciente: data.id_paciente
            },
            data: {
                id_paciente: data.id_paciente,
                nombre: data.nombre,
                apellido: data.apellido,
                dni: data.dni,
                sexo: data.sexo,
                fecha_nacimiento: data.fecha_nacimiento,
                direccion: data.direccion,
                telefono: data.telefono,
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

export const deletePatient = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string;
    try {
        await prisma.paciente.delete({
            where: {
                id_paciente: parseInt(id),
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