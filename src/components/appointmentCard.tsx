import prisma from "@/lib/prisma"

const AppointmentCard = async ({ type }: { type: "appountmentTotal" | "patientsTotal" | "appountmentNext" }) => {
    const modelMap: Record<typeof type, any> = {
        appountmentTotal: prisma.cita,
        patientsTotal: prisma.paciente,
        appountmentNext: prisma.cita,
    };
    let data;
    if (type === "appountmentNext") {
        data = await prisma.cita.count({
            where: {
                estado: {
                    in: ["AGENDADO", "EN_PROCESO"]
                }
            }
        });
    } else {
        data = await modelMap[type].count();
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
                <h1 className="text-2xl font-semibold my-2">{data}</h1>
                <span className="text-[10px] bg-white px-2 py-1 rounded-full self-start">2025/12/01</span>
            </div>

            <h2 className="text-sm font-medium text-gray-500">{nameCards(type)}</h2>

        </div>
    )
}

export default AppointmentCard