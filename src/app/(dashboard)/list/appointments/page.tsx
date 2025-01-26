import AppointmentCard from "@/components/appointmentCard"
import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Empleado, Paciente, Prisma, Servicio, Usuario } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation';
import { useState } from "react"

type AppointmentList = Cita & { paciente: Paciente & { usuario: Usuario }, empleado: Empleado & { usuario: Usuario }, servicio: Servicio }

const columns = [
    {
        header: "Paciente", accessor: "paciente"
    },
    {
        header: "Fecha de cita", accessor: "fechaCita"
    },
    {
        header: "Hora de cita", accessor: "horaCita", className: "hidden md:table-cell"
    },
    {
        header: "Doctor asignado", accessor: "doctorAsignado", className: "hidden md:table-cell"
    },
    {
        header: "Servicio", accessor: "servicio", className: "hidden md:table-cell"
    },
    {
        header: "Tarifa", accessor: "tarifa", className: "hidden md:table-cell"
    },
    {
        header: "Estado", accessor: "estado", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: AppointmentList) => (
    <tr key={item.id_cita} className="border-b border-gray-300 even:bg-gray-300 text-sm hover:bg-sky-100">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.paciente.usuario.nombre} ${item.paciente.usuario.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.paciente.usuario.dni}</p>
            </div>
        </td>
        <td className="table-cell">
            {new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(item.fecha_cita))}
        </td>
        <td className="hidden md:table-cell">
            {item.hora_cita_inicial?.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false })}</td>
        <td className="hidden md:table-cell">{`${item.empleado.usuario.nombre} ${item.empleado.usuario.apellido}`}</td>
        <td className="hidden md:table-cell">{item.servicio.nombre_servicio}</td>
        <td className="hidden md:table-cell">{item.servicio.tarifa}</td>
        <td className="hidden md:table-cell">{item.estado}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/clientes/${item.id_cita}`}>
                    <FormContainer table="cita" type="view" />
                </Link>
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
    searchParams: { [key: string]: string | undefined };
}) => {
    const params = searchParams;

    const { page, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;
    const numPage = 10; // Número de registros por página

    const query: Prisma.CitaWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "doctorId":
                        query.empleado = {
                            id_empleado: parseInt(value),
                        };
                        break;

                    case "search":
                        const searchTerms = value.split(" ");
                        query.AND = searchTerms.map((term) => ({
                            OR: [
                                {
                                    paciente: {
                                        usuario: { nombre: { contains: term, mode: "insensitive" }, },
                                    },
                                },
                                {
                                    paciente: {
                                        usuario: { apellido: { contains: term, mode: "insensitive" }, },
                                    },
                                },
                                {
                                    paciente: {
                                        usuario: { dni: { contains: term, mode: "insensitive" }, },
                                    },
                                },
                                {
                                    empleado: {
                                        usuario: { nombre: { contains: term, mode: "insensitive" }, },
                                    },
                                },
                                {
                                    empleado: {
                                        usuario: { apellido: { contains: term, mode: "insensitive" }, },
                                    },
                                },
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
                servicio: {
                    select: {
                        nombre_servicio: true,
                        tarifa: true,
                    },
                },
            },
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.cita.count({ where: query }),
    ]);

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* CARTAS CITAS */}
            <div className=''>
                <div className="flex items-center justify-between p-4">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de citas</h1>
                </div>

                <div className='flex gap-4 justify-between flex-wrap'>
                    <AppointmentCard type='Citas totales' />
                    <AppointmentCard type='Pacientes totales' />
                    <AppointmentCard type='Próximas citas' />
                </div>
            </div>
            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='p-4 rounded-md flex-1 m-4 mt-0'>
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
            </div>
            {/*PAGINACION*/}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default AppointmentListPage