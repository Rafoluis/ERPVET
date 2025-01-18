import { z } from "zod";

export const appointmentSchema = z.object({
    id: z.coerce.number().optional(),
    id_paciente: z.coerce.number().min(1, { message: "Paciente requerido" }),
    fecha_cita: z.coerce.date({ message: "Fecha requerida" }),
    //fecha_cita: z.coerce.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Fecha requerida" }),
    hora_cita_inicial: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato de hora HH:mm incorrecto" }),
    hora_cita_final: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato de hora HH:mm incorrecto" }),
    id_servicio: z.coerce.number().min(1, { message: "Servicio requerido" }),
    id_empleado: z.coerce.number().min(1, { message: "Doctor requerido" }),
    estado: z.enum(["AGENDADO", "COMPLETADO", "EN_PROCESO", "FINALIZADO", "CANCELADO"], { message: "Estado requerido" }),
    //note: z.string().optional(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;