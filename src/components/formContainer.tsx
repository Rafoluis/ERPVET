import prisma from "@/lib/prisma";
import FormModal from "./formModal";

export type FormContainerProps = {
    table: "cita" | "paciente" | "empleado";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {};

    if (type !== "delete") {
        switch (table) {
            case "cita":
                const appointmentPatient = await prisma.paciente.findMany({
                    select: {
                        id_paciente: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                });

                const appointmentDoctor = await prisma.empleado.findMany({
                    select: {
                        id_empleado: true,
                        usuario: {
                            select: {
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
                        id_paciente: p.id_paciente,
                        nombre: p.usuario.nombre,
                        apellido: p.usuario.apellido,
                    })),
                    empleados: appointmentDoctor.map((d) => ({
                        id_empleado: d.id_empleado,
                        nombre: d.usuario.nombre,
                        apellido: d.usuario.apellido,
                    })),
                    servicios: appointmentService.map((s) => ({
                        id_servicio: s.id_servicio,
                        nombre_servicio: s.nombre_servicio,
                        tarifa: s.tarifa,
                    })),
                };
                //console.log(relatedData);
                break;
            case "paciente":
                const usuariosPacientes = await prisma.usuario.findMany({
                    where: { paciente: { isNot: null } },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                    },
                });
                relatedData = {
                    usuarios: usuariosPacientes.map((u) => ({
                        id_usuario: u.id_usuario,
                        nombre: `${u.nombre} ${u.apellido}`,
                    })),
                };
                break;
            case "empleado":
                const usuariosEmpleados = await prisma.usuario.findMany({
                    where: { empleado: { isNot: null } },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                    },
                });
                relatedData = {
                    usuarios: usuariosEmpleados.map((u) => ({
                        id: u.id_usuario,
                        nombre: `${u.nombre} ${u.apellido}`,
                    })),
                };
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;