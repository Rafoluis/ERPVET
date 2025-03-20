import prisma from "@/lib/prisma";
import BigCalendar from "./calendar";

function convertUTCToNaive(date: Date): Date {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
    );
}

const BigCalendarContainer = async ({
    type,
    id,
}: {
    type: "id_empleado" | "id_paciente";
    id: string | number;
}) => {
    const numericId = typeof id === "number" ? id : Number(id);
    console.log("numericId:", numericId);

    const dataRes = await prisma.cita.findMany({
        where:
            type === "id_empleado"
                ? { id_empleado: numericId }
                : { id_paciente: numericId },
        include: {
            paciente: {
                include: {
                    usuario: true,
                },
            },
        },
    });
    console.log("dataRes:", dataRes);

    const validCitas = dataRes.filter(
        (cita) => cita.hora_cita_inicial !== null && cita.hora_cita_final !== null
    );

    const data = validCitas.map((cita) => ({
        title: `${cita.paciente.usuario.nombre} ${cita.paciente.usuario.apellido}`,
        start: convertUTCToNaive(cita.hora_cita_inicial!),
        end: convertUTCToNaive(cita.hora_cita_final!),
    }));

    console.log("data:", data)

    return (
        <div style={{ minHeight: '500px' }}>
            <BigCalendar data={data} />
        </div>
    );
};

export default BigCalendarContainer;
