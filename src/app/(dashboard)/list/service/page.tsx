import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Prisma, Servicio } from "@prisma/client"

type ServicioList = Servicio;

const columns = [
    {
        header: "Id", accessor: "id_servicio"
    },
    {
        header: "Nombre del servicio", accessor: "nombre_servicio"
    },
    {
        header: "Descripción", accessor: "descripcion", className: "hidden md:table-cell"
    },
    {
        header: "Tarifa", accessor: "tarifa", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: ServicioList) => (
    <tr key={item.id_servicio} className="border-b border-gray-200 even:bg-backhoverbutton text-sm hover:bg-backgroundgray">
        <td className="hidden md:table-cell p-2">{item.id_servicio}</td>
        <td className="hidden md:table-cell">{item.nombre_servicio}</td>
        <td className="hidden md:table-cell">{item.descripcion}</td>
        <td className="hidden md:table-cell">{`S/ ${Number(item.tarifa).toFixed(2)}`}</td>
        <td>
            <div className="flex items-center gap-2">
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="servicio" type="update" data={item}
                        />
                        <FormContainer table="servicio" type="delete" id={item.id_servicio} />
                    </>
                )}
            </div>
        </td>
    </tr >
);

const ServiceListPage = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const params = await searchParams;
    const { page, sort, column, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.ServicioWhereInput = {
        deletedAt: null,
    };

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && key !== "sortColumn" && key !== "sortDirection") {
            if (key === "id_servicio") {
                query.id_servicio = parseInt(value);
            } else if (key === "search") {
                query.OR = [
                    { nombre_servicio: { contains: value, mode: "insensitive" } },
                    { descripcion: { contains: value, mode: "insensitive" } },
                ];
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.servicio.findMany({
            where: query,
            orderBy: column
                ? { [column]: sort === "asc" ? "asc" : "desc" }
                : undefined,
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.servicio.count({ where: query }),
    ]);

    return (
        <div>
            <div className=' rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de servicios</h1>
                </div>
            </div>

            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Servicios</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="servicio" type="create" />
                        </div>
                    </div>
                </div>
                {/* TABLA */}
                <Table columns={columns} renderRow={renderRow} data={data} />

                {/*PAGINACION*/}
                <Pagination page={p} count={count} />
            </div>
        </div>
    )
}

export default ServiceListPage