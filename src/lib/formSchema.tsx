import { EventType } from "@prisma/client";
import { z } from "zod";

export const appointmentSchema = z.object({
    id_cita: z.coerce.number().optional(),
    id_paciente: z.preprocess(
        (val) => {
            if (val === "" || val == null) return undefined;
            return Number(val);
        },
        z.number().min(1, { message: "Paciente requerido" }).optional()
    ).refine((val) => val !== undefined, { message: "Paciente requerido" }),
    fecha_cita: z.coerce.date({ message: "Fecha y hora requerida" }),
    hora_cita_final: z
        .string()
        .refine(
            (value) => value === "" || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value),
            { message: "Formato de hora inválido (HH:MM)" }
        )
        .optional(),
    servicios: z
        .array(
            z.object({
                id_servicio: z.preprocess(
                    (val) => {
                        if (val === "" || val == null) return undefined;
                        return Number(val);
                    },
                    z.number().min(1, { message: "ID de servicio inválido" }).optional()
                ).refine((val) => val !== undefined, { message: "ID de servicio inválido" }),
                cantidad: z.preprocess(
                    (val) => {
                        if (val === "" || val == null) return undefined;
                        return Number(val);
                    },
                    z.number().min(1, { message: "Cantidad inválida" }).optional()
                ).refine((val) => val !== undefined, { message: "Cantidad inválida" }),
            })
        )
        .min(1, { message: "Debe seleccionar al menos un servicio" }),
    id_empleado: z.preprocess(
        (val) => {
            if (val === "" || val == null) return undefined;
            return Number(val);
        },
        z.number().min(1, { message: "Doctor requerido" }).optional()
    ).refine((val) => val !== undefined, { message: "Doctor requerido" }),
    estado: z.enum(
        ["AGENDADO", "COMPLETADO", "EN_PROCESO", "FINALIZADO", "CANCELADO"],
        { message: "Estado requerido" }
    ),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const patientSchema = z.object({
    id_paciente: z.coerce.number().optional(),
    nombre: z.string().min(1, { message: "Nombre requerido" }),
    apellido: z.string().min(1, { message: "Apellido requerido" }),
    dni: z.string().regex(/^\d{8}$/, { message: "DNI inválido. Debe contener 8 dígitos." }),
    sexo: z.enum(["MASCULINO", "FEMENINO"]),
    fecha_nacimiento: z.coerce.date({ message: "Fecha nacimiento requerida" }),
    telefono: z.string().min(1, { message: "Teléfono requerido" }),
    password: z.string().optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;

export const pagoSchema = z.object({
    monto: z.number().positive({ message: "El monto debe ser mayor que 0" }),
    fecha_pago: z.coerce.date({ message: "Fecha requerida" }),
    medio_pago: z.enum(
        [
            "EFECTIVO",
            "TARJETA DEBITO",
            "TARJETA CREDITO",
            "DEPOSITO BANCARIO",
            "YAPE - PLIN",
        ],
        { message: "Medio de pago inválido" }
    ),
});

export const ticketSchema = z
    .object({
        id_ticket: z.coerce.number().optional(),
        id_paciente: z.coerce.number().min(1, { message: "Paciente requerido" }),
        citas: z
            .array(z.coerce.number().min(1, { message: "ID de cita requerido" }))
            .optional(),
        fecha_emision: z.coerce.date({ message: "Fecha requerida" }),
        tipo_comprobante: z.enum(["BOLETA", "FACTURA"], {
            message: "Tipo requerido",
        }),
        medio_pago: z.enum(
            [
                "EFECTIVO",
                "TARJETA DEBITO",
                "TARJETA CREDITO",
                "DEPOSITO BANCARIO",
                "YAPE - PLIN",
            ],
            { message: "Medio requerido" }
        ),
        fraccionar_pago: z.boolean().optional(),
        monto_parcial: z
            .preprocess(
                (val) =>
                    val === "" || val === undefined ? 0 : parseFloat(val as string),
                z.number().min(0, { message: "El monto parcial debe ser mayor o igual a 0" }).optional()
            ),
        monto_total: z.number().min(0, { message: "El monto total es obligatorio" }),
        pagos: z.array(pagoSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.fraccionar_pago) {
            if (!data.monto_parcial || data.monto_parcial <= 0) {
                ctx.addIssue({
                    path: ["monto_parcial"],
                    code: z.ZodIssueCode.custom,
                    message:
                        "Ingrese un monto parcial válido si está fraccionando el pago",
                });
            }
            if (data.monto_parcial !== undefined && data.monto_parcial >= data.monto_total) {
                ctx.addIssue({
                    path: ["monto_parcial"],
                    code: z.ZodIssueCode.custom,
                    message: "El monto parcial debe ser menor que el monto total",
                });
            }
        } else {
            if (data.monto_parcial && data.monto_parcial > 0) {
                ctx.addIssue({
                    path: ["monto_parcial"],
                    code: z.ZodIssueCode.custom,
                    message: "No se debe ingresar un monto parcial si no se fracciona el pago",
                });
            }
        }
    });

export type TicketSchema = z.infer<typeof ticketSchema>;

export const serviceSchema = z.object({
    id_servicio: z.coerce.number().optional(),
    nombre_servicio: z.string().min(1, { message: "Nombre requerido" }),
    descripcion: z.string().optional(),
    tarifa: z.coerce.number(),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

export const doctorSchema = z.object({
    id_empleado: z.coerce.number().optional(),
    nombre: z.string().min(1, { message: "Nombre requerido" }),
    apellido: z.string().min(1, { message: "Apellido requerido" }),
    dni: z.string().regex(/^\d{8}$/, { message: "DNI inválido. Debe contener 8 dígitos." }),
    sexo: z.enum(["MASCULINO", "FEMENINO"]),
    email: z.string().email({ message: "Email inválido" }).optional(),
    telefono: z.string().min(1, { message: "Teléfono requerido" }),
    direccion: z.string().optional(),
    password: z.string().min(5, { message: "La contraseña debe tener más de 5 caracteres" }),
    especialidad: z.string().min(1, { message: "Especialidad requerida" }),
});

export type DoctorSchema = z.infer<typeof doctorSchema>;

export const mascotaSchema = z.object({
    idMascota: z.coerce.number().optional(),
    idPropietario: z.coerce.number({
    invalid_type_error: "Propietario inválido",
    required_error: "Debe seleccionar un propietario",
    }),
    nombre: z.string().min(1, { message: "Nombre requerido" }),
    especie: z.string().min(1, { message: "Especie requerida" }),
    raza: z.string().optional(),
    sexo: z.enum(["MACHO", "HEMBRA"], {
    required_error: "Sexo requerido",
    }),
    fechaNacimiento: z.coerce.date({ message: "Fecha nacimiento requerida" }),
    peso: z.coerce.number().optional(),
    numeroChip: z.string().optional(),
    esterilizado: z.boolean().optional(),
    alergias: z.string().optional(),
    notasComportamiento: z.string().optional(),
    img:z.string().optional()
});

export type MascotaSchema = z.infer<typeof mascotaSchema>;

export const historiaSchema = z.object({
  idHistoriaClinica: z.coerce.number().optional(),
  idMascota: z.coerce.number({
    invalid_type_error: "Mascota inválida",
    required_error: "Debe seleccionar una mascota",
  }),
  // Datos Generales
  tamaño: z.string().min(1, { message: "Tamaño requerido" }),
  color: z.string().min(1, { message: "Color requerido" }),
  señalesParticulares: z.string().min(1, { message: "Señales particulares requeridas" }),
  finZootecnico: z.string().min(1, { message: "Fin zootécnico requerido" }),
  origenProcedencia: z.string().min(1, { message: "Origen/Procedencia requerida" }),

  // Anamnesis fija
  enfermedadPrevia: z.string().min(1, { message: "Enfermedad previa requerida" }),
  alimentacion: z.string().min(1, { message: "Alimentación requerida" }),
  habitad: z.string().min(1, { message: "Hábitat requerido" }),
  viajesRecientes: z.string().min(1, { message: "Viajes recientes requeridos" }),
  convivencia: z.string().min(1, { message: "Convivencia requerida" }),
  comportamiento: z.string().min(1, { message: "Comportamiento requerido" }),

  // Otros campos
  partos: z.coerce.number().min(0, { message: "Partos debe ser un número >= 0" }),
  viveConAnimales: z.boolean({ required_error: "Indica si vive con otros animales" }),

  fechaCreacion: z.coerce.date().optional(),

  // Arrays relacionales
  previasEnfermedades: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        descripcion: z.string().min(1, { message: "Descripción requerida" }),
        fecha: z
          .string()
          .optional()
          .refine((s) => !s || !isNaN(Date.parse(s)), { message: "Fecha inválida" }),
      })
    )
    .optional(),

  previasCirugias: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        descripcion: z.string().min(1, { message: "Descripción requerida" }),
        fecha: z
          .string()
          .optional()
          .refine((s) => !s || !isNaN(Date.parse(s)), { message: "Fecha inválida" }),
      })
    )
    .optional(),

  tratamientosRecientes: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        descripcion: z.string().min(1, { message: "Descripción requerida" }),
        fechaInicio: z
          .string()
          .optional()
          .refine((s) => !s || !isNaN(Date.parse(s)), { message: "Fecha de inicio inválida" }),
        fechaFin: z
          .string()
          .optional()
          .refine((s) => !s || !isNaN(Date.parse(s)), { message: "Fecha de fin inválida" }),
      })
    )
    .optional(),
});

export type HistoriaSchema = z.infer<typeof historiaSchema>;

export const timelineSchema = z.object({
  id: z.coerce
    .number()
    .optional()
    .describe("ID del evento en línea de tiempo (sólo para actualizaciones)"),
  idHistoriaClinica: z.coerce
    .number({
      required_error: "Debe proporcionar la historia clínica",
      invalid_type_error: "ID de historia inválido",
    })
    .describe("ID de la historia clínica a la que pertenece el evento"),
  tipo: z.nativeEnum(EventType, {
    required_error: "Tipo de evento requerido",
  }).describe("Tipo de evento en línea de tiempo"),
  titulo: z
    .string()
    .min(1, { message: "Título requerido" })
    .describe("Título del evento"),
  ubicacion: z
    .string()
    .min(1, { message: "Ubicación requerida" })
    .describe("Ubicación del evento"),
  descripcion: z
    .string()
    .min(1, { message: "Descripción requerida" })
    .describe("Descripción del evento"),
  detalles: z
    .array(z.string().min(1))
    .optional()
    .describe("Lista de puntos detallados del evento"),
});

export type TimeLineSchema = z.infer<typeof timelineSchema>;

export const registroVacunacionSchema = z.object({
  idRegistroVacuna: z.coerce.number().optional(),

  idMascota: z.coerce.number({
    invalid_type_error: "Mascota inválida",
    required_error: "Debe seleccionar una mascota",
  }),

  nombreVacuna: z.string()
    .min(1, { message: "Nombre de la vacuna requerido" }),

  fechaAdministracion: z.coerce.date({
    invalid_type_error: "Fecha de administración inválida",
  }).optional(),

  fechaProxima: z.coerce.date({
    invalid_type_error: "Fecha próxima inválida",
  }).optional(),

  lote: z.string().optional(),

  veterinario: z.string().optional(),
});

export type RegistroVacunacionSchema = z.infer<typeof registroVacunacionSchema>;

export const propietarioSchema = z.object({
  idPropietario: z.coerce.number().optional(),
  dni: z.coerce
    .number()
    .int({ message: "El DNI debe ser un número entero" })
    .min(1000000, { message: "DNI demasiado corto" })
    .max(9999999999, { message: "DNI demasiado largo" }),
  nombre: z
    .string()
    .min(1, { message: "El nombre es obligatorio" }),
  apellido: z
    .string()
    .min(1, { message: "El apellido es obligatorio" }),
  correo: z
    .string()
    .email({ message: "Correo inválido" }),
  telefono: z
    .string()
    .min(6, { message: "Teléfono muy corto" })
    .max(15, { message: "Teléfono muy largo" }),
  direccion: z
    .string()
    .optional()
    .or(z.literal("")), // Para permitir string vacío desde formularios
});

export type PropietarioSchema = z.infer<typeof propietarioSchema>;
