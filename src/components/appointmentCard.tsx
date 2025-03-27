import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

export const getCurrentDatePeru = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

interface AppointmentCardProps {
    type: "appountmentTotal" | "patientsTotal" | "appountmentNext";
    date: string;
}

const AppointmentCard = async ({ type, date }: AppointmentCardProps) => {
    const session = await getServerSession(authOptions);
    const odontologoFilter =
        session?.user?.role === "ODONTOLOGO"
            ? { empleado: { usuario: { id_usuario: parseInt(session.user.id) } } }
            : {};

    let data;
    if (type === "appountmentNext") {
        data = await prisma.cita.count({
            where: {
                estado: { in: ["AGENDADO", "EN_PROCESO"] },
                ...odontologoFilter,
            },
        });
    } else if (type === "appountmentTotal") {
        data = await prisma.cita.count({
            where: {
                ...odontologoFilter,
            },
        });
    } else if (type === "patientsTotal") {
        if (session?.user?.role === "ODONTOLOGO") {
            data = await prisma.paciente.count({
                where: {
                    citas: {
                        some: {
                            ...odontologoFilter,
                        },
                    },
                },
            });
        } else {
            data = await prisma.paciente.count();
        }
    }

    const nameCards = (type: string) => {
        return type
            .replace("appountmentTotal", "Total de citas")
            .replace("patientsTotal", "Total de pacientes")
            .replace("appountmentNext", "Próxima cita");
    };

    return (
        <div className="rounded-2xl bg-backgrounddefault p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold my-2 text-textblue">{data}</h1>
                <span className="text-[10px] bg-white px-2 py-1 rounded-full self-start">{date}</span>
            </div>
            <h2 className="font-bold text-textred">{nameCards(type)}</h2>
        </div>
    );
};

export default AppointmentCard;
