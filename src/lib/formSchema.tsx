import { z } from "zod";

export const appointmentSchema = z.object({
    id_cita: z.coerce.number().optional(),
    id_paciente: z.coerce.number().min(1, { message: "Paciente requerido" }),
    fecha_cita: z.coerce.date({ message: "Fecha y hora requerida" }),
    hora_cita_final: z
        .string()
        .refine(value => value === "" || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value), {
            message: "Formato de hora inválido (HH:MM)"
        })
        .optional(),
    id_servicio: z.coerce.number().min(1, { message: "Servicio requerido" }),
    id_empleado: z.coerce.number().min(1, { message: "Doctor requerido" }),
    estado: z.enum(
        ["AGENDADO", "COMPLETADO", "EN_PROCESO", "FINALIZADO", "CANCELADO"],
        { message: "Estado requerido" }
    ),
    //note: z.string().optional(),

});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const patientSchema = z.object({
    id_paciente: z.coerce.number().optional(),
    nombre: z.string().min(1, { message: "Nombre requerido" }),
    apellido: z.string().min(1, { message: "Apellido requerido" }),
    dni: z.string().min(1, { message: "DNI requerido" }),
    //fecha_cita: z.coerce.date({ message: "Fecha requerida" }),
    sexo: z.enum(["MASCULINO", "FEMENINO"]),
    fecha_nacimiento: z.coerce.date({ message: "Fecha nacimiento requerida" }),
    telefono: z.string().min(1, { message: "Telefono requerido" }),
    password: z.string().optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;