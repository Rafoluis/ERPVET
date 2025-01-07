import CitasCard from "@/app/components/citasCard"
import FormModal from "@/app/components/formModal"
import Table from "@/app/components/table"
import TableSearch from "@/app/components/tableSearch"
import { clientesData } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"

type ClienteP = {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    fechaCita: number;
    horaCita: number;
    doctorAsignado: string;
    servicio: string;
    tarifa: number;
    estado: string;
}

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

const RecepcionPage = () => {

    const renderRow = (item: ClienteP) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-sky-50">
            <td className="flex items-center gap-4 p-2">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{`${item.nombre} ${item.apellido}`}</h3>
                    <p className="text-xs text-gray-500">{item.dni}</p>
                </div>
            </td>
            <td className="table-cell">{item.fechaCita}</td>
            <td className="table-cell">{item.horaCita}</td>
            <td className="hidden md:table-cell">{item.doctorAsignado}</td>
            <td className="hidden md:table-cell">{item.servicio}</td>
            <td className="hidden md:table-cell">{item.tarifa}</td>
            <td className="hidden md:table-cell">{item.estado}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={'/list/clientes/${item.id}'}>
                        <FormModal table="cita" type="view" />
                    </Link>
                    {"recepcionista" === "recepcionista" && (
                        <>
                            <FormModal table="cita" type="update" id={item.id} />
                            <FormModal table="cita" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* CARTAS CITAS */}
            <div className=''>
                <div className="flex items-center justify-between p-4">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de citas</h1>
                </div>

                <div className='flex gap-4 justify-between flex-wrap'>
                    <CitasCard type='Citas totales' />
                    <CitasCard type='Pacientes totales' />
                    <CitasCard type='Próximas citas' />
                </div>
            </div>

            <div className='p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Citas</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormModal table="cita" type="create" />
                        </div>
                    </div>
                </div>
                {/*LIST*/}
                <Table columns={columns} renderRow={renderRow} data={clientesData} />
            </div>

        </div>
    )
}

export default RecepcionPage