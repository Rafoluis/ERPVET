import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Prisma, Empleado } from "@prisma/client"
import Link from "next/link"

type DoctorList = Empleado & { usuario: { nombre: string; apellido: string; dni: string; }; };

const columns = [
    {
        header: "Nombre de odontólogo", accessor: "nombre"
    },
    {
        header: "Especialidad", accessor: "especialidad", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: DoctorList) => (
    <tr key={item.id_empleado} className="border-b border-gray-200 even:bg-backgroundgray text-sm hover:bg-backhoverbutton" >
        <td>
            <div className="flex items-center gap-4 p-2">
                <div className="flex flex-col">
                    <h3 className="font-semibold">
                        {`${item.usuario.nombre} ${item.usuario.apellido}`}
                    </h3>
                    <p className="text-xs text-gray-500">{item.usuario.dni}</p>
                </div>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.especialidad}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/clientes/${item.id_empleado}`}>
                    <FormContainer table="cita" type="view" />
                </Link>
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="doctor" type="update" data={item} />
                        <FormContainer table="doctor" type="delete" id={item.id_empleado} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const DoctorListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const params = await searchParams;
    const { page, sort, column, start, end, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.EmpleadoWhereInput = {
        usuario: {
            roles: {
                some: {
                    rol: {
                        nombre: "ODONTOLOGO",
                    },
                },
            },
        },
    };

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && key !== "sortColumn" && key !== "sortDirection") {
            if (key === "id_empleado") {
                query.id_empleado = parseInt(value);
            } else if (key === "search") {
                query.OR = [
                    { usuario: { nombre: { contains: value, mode: "insensitive" } } },
                    { usuario: { apellido: { contains: value, mode: "insensitive" } } },
                    { usuario: { dni: { contains: value, mode: "insensitive" } } },
                ];
            }
        }
    }

    if (start || end) {
        query.usuario = {
            fecha_creacion: {
                gte: start ? new Date(start) : undefined,
                lte: end ? new Date(end) : undefined,
            }
        };
    }

    const [data, count] = await prisma.$transaction([
        prisma.empleado.findMany({
            where: {
                AND: [
                    query, 
                    {
                        usuario: {
                            roles: {
                                some: { rol: { nombre: "ODONTOLOGO" } } } 
                        }
                    }
                ]
            },
            include: { usuario: true },
            orderBy: column
                ? column === "doctor_info" || column === "nombre"
                    ? { usuario: { nombre: sort === "asc" ? "asc" : "desc" } }
                    : column === "especialidad"
                    ? { especialidad: sort === "asc" ? "asc" : "desc" }
                    : { [column]: sort === "asc" ? "asc" : "desc" }
                : undefined,
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.empleado.count({
            where: {
                AND: [
                    query,
                    {
                        usuario: {
                            roles: {
                                some: { rol: { nombre: "ODONTOLOGO" } } }
                        }
                    }
                ]
            }
        }),
    ]);
    
    return (
        <div>
            <div className="rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">
                        Gestión de doctores
                    </h1>
                </div>
            </div>

            {/* BÚSQUEDA Y AGREGAR DOCTOR */}
            <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h2 className="hidden md:block text-ls font-semibold">Doctores</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="doctor" type="create" />
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <Table columns={columns} renderRow={renderRow} data={data} />

                {/* PAGINACIÓN */}
                <Pagination page={p} count={count} />
            </div>
        </div>
    );
};

export default DoctorListPage;