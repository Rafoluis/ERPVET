import { z } from "zod";

export const appointmentSchema = z.object({
    id: z.coerce.number().optional(),
    patient: z.string().min(1, { message: "Paciente requerido" }),
    date: z.coerce.date({ message: "Fecha requerida" }),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato de hora HH:mm incorrecto" }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato de hora HH:mm incorrecto" }),
    service: z.enum(["Limpieza dental", "Consulta", "Extracción"], { message: "Servicio requerido" }),
    serviceFee: z.coerce.number({
        invalid_type_error: "El valor debe ser un número válido.",
    }).min(1, { message: "Tarifa requerida y debe ser mayor a 0" }),
    assignedDoctor: z.array(z.string(), { message: "Doctor requerido" }),
    note: z.string().optional(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;