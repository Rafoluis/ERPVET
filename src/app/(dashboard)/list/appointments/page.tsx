import AppointmentCard from "@/components/appointmentCard"
import FormContainer from "@/components/formContainer"
import FormModal from "@/components/formModal"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import { clientesData } from "@/lib/data"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Empleado, Paciente, Prisma, Servicio } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation';
import { useState } from "react"

type AppointmentList = Cita & { paciente: Paciente, empleado: Empleado, servicio: Servicio }

const columns = [
    {
        header: "Paciente", accessor: "paciente"
    },
    {
        header: "Fecha de cita", accessor: "fechaCita"
    },
    {
        header: "Hora de cita", accessor: "horaCita"
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
    <tr key={item.id_cita} className="border-b border-gray-300 even:bg-gray-200 text-sm hover:bg-sky-100">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.paciente.nombre} ${item.paciente.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.paciente.dni}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">
            {new Intl.DateTimeFormat("es-PE").format(item.fecha_cita)}</td>
        <td className="table-cell">
            {item.hora_cita_inicial.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false })}</td>
        <td className="hidden md:table-cell">{`${item.empleado.nombre} ${item.empleado.apellido}`}</td>
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

const AppointmentListPage = ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    // const params = await searchParams;

    // const { page, ...queryParams } = params;

    // const p = page ? parseInt(page) : 1;

    const query: Prisma.CitaWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "doctorId":
                        query.empleado = {
                            id_empleado: parseInt(value)
                        }

                        break;
                    case "search":
                        const searchTerms = value.split(" ");
                        query.AND = searchTerms.map(term => ({
                            OR: [
                                { paciente: { nombre: { contains: term, mode: "insensitive" } } },
                                { paciente: { apellido: { contains: term, mode: "insensitive" } } },
                                { paciente: { dni: { contains: term, mode: "insensitive" } } },
                                { paciente: { telefono: { contains: term, mode: "insensitive" } } },
                                { empleado: { nombre: { contains: term, mode: "insensitive" } } },
                                { empleado: { apellido: { contains: term, mode: "insensitive" } } },
                            ]
                        }));
                        break;
                    default:
                        break;
                };
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.cita.findMany({
            where: query,
            include: {
                paciente: { select: { nombre: true, apellido: true, dni: true } },
                empleado: { select: { nombre: true, apellido: true } },
                servicio: { select: { nombre_servicio: true, tarifa: true } },
            },
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.cita.count({ where: query }),
    ]);

    //console.log("searchParams:", params)
    //console.log(data);
    //console.log(count);

    return (
        <div className=''>
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
            {/* <Pagination page={p} count={count} /> */}
        </div>
    )
}

export default AppointmentListPage