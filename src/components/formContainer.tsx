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
                    select: { id_paciente: true, nombre: true, apellido: true },
                });
                const appointmentDoctor = await prisma.empleado.findMany({
                    select: { id_empleado: true, nombre: true, apellido: true },
                });
                const appointmentService = await prisma.servicio.findMany({
                    select: { id_servicio: true, nombre_servicio: true, tarifa: true },
                });

                relatedData = { pacientes: appointmentPatient, empleados: appointmentDoctor, servicios: appointmentService };
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