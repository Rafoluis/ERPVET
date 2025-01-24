import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Empleado, Historia_Clinica, Paciente, Prisma, Servicio } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns";

// export const formatDateToLocal = (date: Date): string => {
//     const localDate = new Date(date);
//     return localDate.toLocaleDateString("es-PE", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//     });
// };

type PatientList = Paciente & { citas: Cita[], historiaClinica: Historia_Clinica[] }

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
    <tr key={item.id_paciente} className="border-b border-gray-300 even:bg-slate-300 text-sm hover:bg-sky-100">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.nombre} ${item.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.dni}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.telefono}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("es-PE").format(item.fecha_nacimiento)}</td>
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

const PatientListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
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
                        const searchTerms = value.split(" ");
                        query.AND = searchTerms.map((term) => ({
                            OR: [
                                { nombre: { contains: term, mode: "insensitive" } },
                                { apellido: { contains: term, mode: "insensitive" } },
                            ],
                        }));
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
                citas: { select: { id_cita: true } },
                historiaClinica: { select: { id_historia: true } },
            },
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.paciente.count({ where: query }),
    ]);

    //console.log("searchParams:", params)
    //console.log(data);
    //console.log(count);

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            <div className=''>
                <div className="flex items-center justify-between p-4">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de pacientes</h1>
                </div>
            </div>
            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='p-4 rounded-md flex-1 m-4 mt-0'>
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
            </div>
            {/*PAGINACION*/}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default PatientListPage