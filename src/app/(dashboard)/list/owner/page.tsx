import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Mascota, Prisma, Propietario} from "@prisma/client"

type PropietarioList = Propietario & { mascotas: Mascota[];};

const columns = [
  {
    header: "Propietario", accessor: "nombreCompleto",
  },
  {
    header: "Teléfono", accessor: "telefono", className: "hidden md:table-cell",
  },
  {
    header: "Correo", accessor: "correo", className: "hidden lg:table-cell",
  },
  {
    header: "Dirección", accessor: "direccion", className: "hidden lg:table-cell",
  },
  {
    header: "Mascotas", accessor: "mascotas", className: "hidden md:table-cell",
  },
  {
    header: "Acciones", accessor: "acciones",
  },
];

const renderRow = (item: PropietarioList) => (
    <tr key={item.idPropietario} className="border-b border-gray-300 even:bg-backcolumtable text-sm hover:bg-tablehover">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.nombre} ${item.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.dni}</p>
            </div>
        </td>
        {/* <td className="table-cell">
            {item.fecha_nacimiento
                ? new Date(item.fecha_nacimiento).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : ""}
        </td> */}

        <td className="hidden md:table-cell p-2">{item.telefono}</td>

        <td className="hidden lg:table-cell p-2">{item.correo}</td>

        <td className="hidden lg:table-cell p-2">{item.direccion || "-"}</td>

        <td className="hidden md:table-cell p-2">
        {item.mascotas.length > 0
            ? item.mascotas.map((m) => m.nombre).join(", ")
            : "-"}
        </td>

      {/* Acciones */}
      <td className="p-2">
        <div className="flex items-center gap-2">
          {/* Modal ver */}
          <FormContainer table="propietario" type="view" data={item} />
          {/* Modal editar */}
          <FormContainer table="propietario" type="update" data={item} />
          {/* Modal eliminar */}
          <FormContainer table="propietario" type="delete" id={item.idPropietario} />
        </div>
      </td>
    </tr >
);

const PatientListPage = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const params = await searchParams;
    const { page, sort, column, start, end, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.PropietarioWhereInput = {
        deletedAt: null,
    };
      if (queryParams.search) {
    const v = queryParams.search;
    query.OR = [
      { nombre: { contains: v, mode: "insensitive" } },
      { apellido: { contains: v, mode: "insensitive" } }
    ];
  }

    const [data, count] = await prisma.$transaction([
        prisma.propietario.findMany({
            where: query,
            include: {
                mascotas: { select: { nombre: true } },
            },
            orderBy: column
            ? column === "dni" || column === "telefono" || column === "correo"
                ? { [column]: sort === "asc" ? "asc" : "desc" }
                : { [column]: sort === "asc" ? "asc" : "desc" }
            : undefined,
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.propietario.count({ where: query }),
    ]);

    return (
        <div>
            <div className=' rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de Propietarios</h1>
                </div>
            </div>

            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Propietarios</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="propietario" type="create" />
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

export default PatientListPage