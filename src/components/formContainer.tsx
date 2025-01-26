import prisma from "@/lib/prisma";
import FormModal from "./formModal";

export type FormContainerProps = {
    table:
    | "cita"
    | "paciente"
    | "empleado";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number | string;
};


const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {}

    if (type !== "delete") {
        switch (table) {
            case "cita":
                const appointmentPatient = await prisma.paciente.findMany({
                    include: {
                        usuario: {
                            select: {
                                id_usuario: true,
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                });

                const appointmentDoctor = await prisma.empleado.findMany({
                    include: {
                        usuario: {
                            select: {
                                id_usuario: true,
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                });

                const appointmentService = await prisma.servicio.findMany({
                    select: {
                        id_servicio: true,
                        nombre_servicio: true,
                        tarifa: true,
                    },
                });

                relatedData = {
                    pacientes: appointmentPatient.map((p) => ({
                        id: p.id_paciente,
                        nombre: `${p.usuario.nombre} ${p.usuario.apellido}`,
                    })),
                    empleados: appointmentDoctor.map((d) => ({
                        id: d.id_empleado,
                        nombre: `${d.usuario.nombre} ${d.usuario.apellido}`,
                    })),
                    servicios: appointmentService,
                };
                break;
            default:
                break;
        }
    }

    return (
        <div className=''>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;