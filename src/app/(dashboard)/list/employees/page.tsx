import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Prisma, Empleado, Usuario, UsuarioRol, Rol } from "@prisma/client"

type EmpleadoList = Empleado & { usuario: Usuario & { roles: (UsuarioRol & { rol: Rol })[]; }; };

const columns = [
    {
        header: "Empleado", accessor: "nombreEmpleado"
    },
    {
        header: "Sexo", accessor: "usuario.sexo", className: "hidden lg:table-cell",
    },
    {
        header: "Teléfono", accessor: "usuario.telefono", className: "hidden lg:table-cell",
    },
    {
        header: "Dirección", accessor: "usuario.direccion", className: "hidden xl:table-cell",
    },
    {
        header: "Rol(es)", accessor: "roles", className: "hidden md:table-cell",
    },
    {
        header: "Acciones", accessor: "acciones",
    },
];

const renderRow = (item: EmpleadoList) => {
    const rolNames = item.usuario.roles
    .map((ur) => ur.rol.nombre)
    .join(", ");

    return (
    <tr key={item.idEmpleado} className="border-b border-gray-200 even:bg-backhoverbutton text-sm hover:bg-backgroundgray" >
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
        {/* Sexo */}
        <td className="hidden lg:table-cell p-2">{item.usuario.sexo}</td>

        {/* Teléfono */}
        <td className="hidden lg:table-cell p-2">{item.usuario.telefono}</td>

        {/* Dirección */}
        <td className="hidden xl:table-cell p-2">{item.usuario.direccion || "-"}</td>

        {/* Roles */}
        <td className="hidden md:table-cell p-2">{rolNames || "-"}</td>

        <td>
            <div className="flex items-center gap-2">
                {/*
                <Link href={`/list/clientes/${item.id_empleado}`}>
                    <FormContainer table="cita" type="view" />
                </Link>
                */}
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="empleado" type="update" data={item} />
                        <FormContainer table="empleado" type="delete" id={item.idEmpleado} />
                    </>
                )}
            </div>
        </td>
    </tr>
    );
};

const EmpleadoListPage  = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const params = await searchParams;
    const { page, sort, column, start, end, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.EmpleadoWhereInput = {
        deletedAt: null,
        usuario: { deletedAt: null },
    };

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && key !== "sortColumn" && key !== "sortDirection") {
            if (key === "id_empleado") {
                query.idEmpleado = parseInt(value);
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
        (query.usuario as any).fecha_creacion = {
            gte: start ? new Date(start) : undefined,
            lte: end ? new Date(end) : undefined,
        };
    }

    const [data, count] = await prisma.$transaction([
    prisma.empleado.findMany({
        where: query,
        include: {
        usuario: {
            include: {
            roles: {
                include: { rol: true },
            },
            },
        },
        },
        orderBy: column
        ? column.startsWith("usuario.")
            ? {
                usuario: {
                [column.split(".")[1]]: sort === "asc" ? "asc" : "desc",
                },
            }
            : { [column]: sort === "asc" ? "asc" : "desc" }
        : undefined,
        take: numPage,
        skip: numPage * (p - 1),
    }),
    prisma.empleado.count({ where: query }),
    ]);

    return (
        <div>
            <div className="rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">
                        Gestión de médicos
                    </h1>
                </div>
            </div>

            {/* BÚSQUEDA Y AGREGAR DOCTOR */}
            <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h2 className="hidden md:block text-ls font-semibold">Empleados</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="empleado" type="create" />
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

export default EmpleadoListPage ;