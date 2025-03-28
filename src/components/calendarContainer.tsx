import prisma from "@/lib/prisma";
import CalendarClient from "./calendarClient";
import moment from "moment-timezone";

function parseAsPeru(dateInput: string | Date): Date {
    return moment.utc(dateInput).add(5, "hours").toDate();
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
        start: parseAsPeru(cita.hora_cita_inicial!),
        end: parseAsPeru(cita.hora_cita_final!),
    }));

    console.log("data:", data);

    return (
        <div style={{ minHeight: "500px" }}>
            <CalendarClient data={data} />
        </div>
    );
};

export default BigCalendarContainer;
