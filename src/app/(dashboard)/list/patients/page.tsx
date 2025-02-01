import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Historia_Clinica, Paciente, Prisma, Usuario } from "@prisma/client"
import Link from "next/link"

type PatientList = Paciente & { usuario: Usuario, citas: Cita[], historiaClinica: Historia_Clinica[] }

const columns = [
    {
        header: "Paciente", accessor: "paciente"
    },
    {
        header: "Telefono", accessor: "telefonoPaciente"
    },
    {
        header: "Fecha de Nacimiento", accessor: "nacimientoPaciente", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: PatientList) => (
    <tr key={item.id_paciente} className="border-b border-gray-200 even:bg-backgroundgray text-sm hover:bg-backhoverbutton">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.usuario.nombre} ${item.usuario.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.usuario.dni}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.usuario.telefono}</td>
        <td className="table-cell">
            {item.fecha_nacimiento
                ? new Date(item.fecha_nacimiento).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : ""}
        </td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/patients/${item.id_paciente}`}>
                    <FormContainer table="paciente" type="view" />
                </Link>
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="paciente" type="update" data={item}
                        />
                        <FormContainer table="paciente" type="delete" id={item.id_paciente} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const PatientListPage = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const params = await searchParams;
    const { page, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.PacienteWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "id_paciente":
                        query.id_paciente = parseInt(value);
                        break;
                    case "search":
                        query.OR = [
                            { usuario: { nombre: { contains: value, mode: "insensitive" } } },
                            { usuario: { apellido: { contains: value, mode: "insensitive" } } },
                            { usuario: { dni: { contains: value, mode: "insensitive" } } },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.paciente.findMany({
            where: query,
            include: {
                usuario: true,
                citas: { select: { id_cita: true } },
                historiaClinica: { select: { id_historia: true } },
            },
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.paciente.count({ where: query }),
    ]);

    return (
        <div>
            <div className=' rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de pacientes</h1>
                </div>
            </div>

            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Pacientes</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="paciente" type="create" />
                        </div>
                    </div>
                </div>
                {/*LISTA*/}
                <Table columns={columns} renderRow={renderRow} data={data} />

                {/*PAGINACION*/}
                <Pagination page={p} count={count} />
            </div>
        </div>
    )
}

export default PatientListPage