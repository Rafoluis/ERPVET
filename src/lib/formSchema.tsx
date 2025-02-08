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
    servicios: z.array(
        z.object({
            id_servicio: z.coerce.number().min(1, { message: "ID de servicio inválido" }),
            cantidad: z.coerce.number().min(1, { message: "Cantidad inválida" }),
        })
    ).min(1, { message: "Debe seleccionar al menos un servicio" }),
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
    sexo: z.enum(["MASCULINO", "FEMENINO"]),
    fecha_nacimiento: z.coerce.date({ message: "Fecha nacimiento requerida" }),
    telefono: z.string().min(1, { message: "Telefono requerido" }),
    password: z.string().optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;

export const pagoSchema = z.object({
    monto: z.number(),
    fecha_pago: z.coerce.date({ message: "Fecha requerida" }),
    medio_pago: z.enum([
        "EFECTIVO",
        "TARJETA DEBITO",
        "TARJETA CREDITO",
        "DEPOSITO BANCARIO",
        "YAPE - PLIN",
    ]),
});


export const ticketSchema = z.object({
    id_ticket: z.coerce.number().optional(),
    id_paciente: z.coerce.number().min(1, { message: "Paciente requerido" }),
    id_cita: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().optional()
    ),
    fecha_emision: z.coerce.date({ message: "Fecha requerida" }),
    tipo_comprobante: z.enum(["BOLETA", "FACTURA"], { message: "Tipo requerido" }),
    medio_pago: z.enum([
        "EFECTIVO",
        "TARJETA DEBITO",
        "TARJETA CREDITO",
        "DEPOSITO BANCARIO",
        "YAPE - PLIN",
    ], { message: "Medio requerido" }),
    monto_total: z.number(),
    pagos: z.array(pagoSchema).optional(),
});

export type TicketSchema = z.infer<typeof ticketSchema>;