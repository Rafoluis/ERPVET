import AppointmentCard from "@/components/appointmentCard"
import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Empleado, Paciente, Prisma, Servicio, Usuario } from "@prisma/client"
import Link from "next/link"

type AppointmentList = Cita & {
    paciente: Paciente & { usuario: Usuario },
    empleado: Empleado & { usuario: Usuario },
    servicios: {
        servicio: Servicio,
        cantidad: number,
    }[]
};

const columns = [
    {
        header: "Paciente", accessor: "dni"
    },
    {
        header: "Fecha de cita", accessor: "fecha_cita"
    },
    {
        header: "Hora de cita", accessor: "hora_cita_inicial", className: "hidden md:table-cell"
    },
    {
        header: "Médico asignado", accessor: "apellido", className: "hidden md:table-cell"
    },
    {
        header: "Servicio", accessor: "nombre_servicio", className: "hidden md:table-cell"
    },
    {
        header: "Tarifa total", accessor: "tarifa", className: "hidden md:table-cell"
    },
    {
        header: "Estado", accessor: "estado", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: AppointmentList) => (
    <tr key={item.id_cita} className="border-b border-gray-300 even:bg-backhoverbutton text-sm hover:bg-backgroundgray">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.paciente.usuario.nombre} ${item.paciente.usuario.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.paciente.usuario.dni}</p>
            </div>
        </td>
        <td className="table-cell">
            {item.fecha_cita
                ? new Date(item.fecha_cita).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : ""}
        </td>
        <td className="hidden md:table-cell">
            {new Date(item.fecha_cita).toLocaleTimeString("es-PE", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false })}</td>
        <td className="hidden md:table-cell">{`${item.empleado.usuario.nombre} ${item.empleado.usuario.apellido}`}</td>
        <td className="hidden md:table-cell">
            {item.servicios && Array.isArray(item.servicios) && item.servicios.length > 0
                ? item.servicios.map((s) => s.servicio.nombre_servicio).join(", ")
                : "-"}
        </td>
        <td className="hidden md:table-cell">
            {`S/ ${((Array.isArray(item.servicios) && item.servicios.length > 0
                ? item.servicios.reduce((total, s) => total + s.servicio.tarifa * s.cantidad, 0)
                : 0)).toFixed(2)}`}
        </td>
        <td className="hidden md:table-cell">
            <div
                className={`inline-block py-1 px-3 rounded-lg text-textdark ${item.estado === "AGENDADO"
                    ? "bg-backbuttonsecondary"
                    : item.estado === "COMPLETADO"
                        ? "bg-backbuttongreen"
                        : item.estado === "EN_PROCESO"
                            ? "bg-backbuttonyellow"
                            : "bg-backbuttonred"
                    }`}
            >
                {item.estado === "EN_PROCESO" ? "EN PROCESO" : item.estado}
            </div>
        </td>
        <td>
            <div className="flex items-center gap-2">
                {/*
                <Link href={`/list/clientes/${item.id_cita}`}>
                    <FormContainer table="cita" type="view" />
                </Link>
                */}

                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="cita" type="update" data={item}
                        />
                        <FormContainer table="cita" type="delete" id={item.id_cita} />
                    </>
                )}
            </div>
        </td>
    </tr>
);


const AppointmentListPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {

    const params = await searchParams;
    const { page, sort, column, start, end, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.CitaWhereInput = { deletedAt: null };

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "id_empleado":
                        query.empleado = {
                            id_empleado: parseInt(value),
                        };
                        break;

                    case "search":
                        query.OR = [
                            {
                                paciente: {
                                    usuario: { nombre: { contains: value, mode: "insensitive" }, },
                                },
                            },
                            {
                                paciente: {
                                    usuario: { apellido: { contains: value, mode: "insensitive" }, },
                                },
                            },
                            {
                                paciente: {
                                    usuario: { dni: { contains: value, mode: "insensitive" }, },
                                },
                            },
                            {
                                empleado: {
                                    usuario: { nombre: { contains: value, mode: "insensitive" }, },
                                },
                            },
                            {
                                empleado: {
                                    usuario: { apellido: { contains: value, mode: "insensitive" }, },
                                },
                            },
                        ];
                        break;

                    default:
                        break;
                }
            }
        }
    }

    if (start || end) {
        query.fecha_cita = {
            gte: start ? new Date(start) : undefined,
            lte: end ? new Date(end) : undefined,
        };
    }


    const [data, count] = await prisma.$transaction([
        prisma.cita.findMany({
            where: query,
            include: {
                paciente: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                                dni: true,
                            },
                        },
                    },
                },
                empleado: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                },
                servicios: {
                    include: {
                        servicio: {
                            select: {
                                nombre_servicio: true,
                                tarifa: true,
                            },
                        },
                    },
                },
            },
            orderBy: column
                ? column === "dni"
                    ? { paciente: { usuario: { dni: sort === "asc" ? "asc" : "desc" } } }
                    : column === "apellido"
                        ? { empleado: { usuario: { apellido: sort === "asc" ? "asc" : "desc" } } }
                        : column === "nombre_servicio" || column === "tarifa"
                            ? undefined
                            : { [column]: sort === "asc" ? "asc" : "desc" }
                : undefined,
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.cita.count({ where: query }),
    ]);

    if (column === "nombre_servicio" || column === "tarifa") {
        data.sort((a, b) => {
            const servicioA = a.servicios[0]?.servicio;
            const servicioB = b.servicios[0]?.servicio;

            if (column === "tarifa") {
                const tarifaA = servicioA?.tarifa ?? 0;
                const tarifaB = servicioB?.tarifa ?? 0;
                if (tarifaA !== tarifaB) {
                    return sort === "asc" ? tarifaA - tarifaB : tarifaB - tarifaA;
                }
            }

            const nameA = servicioA?.nombre_servicio || "";
            const nameB = servicioB?.nombre_servicio || "";
            return sort === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    }

    return (
        <div>
            <div className=' rounded-md flex-1 m-4 mt-0'>
                {/* CARTAS CITAS */}
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de citas</h1>
                </div>

                <div className='flex gap-4 justify-between flex-wrap'>
                    <AppointmentCard type='appountmentTotal' />
                    <AppointmentCard type='patientsTotal' />
                    <AppointmentCard type='appountmentNext' />
                </div>
            </div>

            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Citas</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="cita" type="create" />
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

export default AppointmentListPage