import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Calendar, ScanBarcode, Dog, PawPrint, CheckCircle, Stethoscope, Plus } from "lucide-react";
import Historia from '@/components/Historia';
import TimelineSection, { RelatedTimeline, RelatedVacunacion } from '@/components/timeline/timeLineSection';
import Link from 'next/link';

export default async function SingleMascotasPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = (typeof (params as any).then === "function")
    ? await (params as Promise<{ id: string }>)
    : (params as { id: string });

  const idMascota = Number(resolvedParams.id);

    const mascota = await prisma.mascota.findUnique({
    where: { idMascota },
    include: {
      propietario: true,
      historialesClinicos: {
        include: {
          previasEnfermedades: true,
          previasCirugias: true,
          tratamientosRecientes: true,
        },
      },
    },
  });
  if (!mascota) return notFound();

  const historiaRaw = mascota.historialesClinicos[0]?? null;

  let consultasParaCliente: any[] = [];
  if (historiaRaw) {
    const idHistoriaClinica = historiaRaw.idHistoriaClinica;
    const consultasRaw = await prisma.lineaTiempo.findMany({
      where: { idHistoriaClinica, deletedAt: null },
      orderBy: { fechaCreacion: "asc" },
    });
    consultasParaCliente = consultasRaw.map((r) => ({
      id: r.id,
      fecha: r.fechaCreacion.toISOString(),
      titulo: r.titulo,
      ubicacion: r.ubicacion,
      descripcion: r.descripcion,
      detalles: r.detalles,
    }));
  }

  const vacunacionesRaw = await prisma.registroVacunacion.findMany({
    where: { idMascota, deletedAt: null },
    orderBy: { fechaAdministracion: "asc" },
    select: {
      idRegistroVacuna: true,
      nombreVacuna: true,
      fechaAdministracion: true,
      fechaProxima: true,
      lote: true,
    },
  });
  const vacunasParaCliente = vacunacionesRaw.map((r) => ({
    idRegistroVacuna: r.idRegistroVacuna,
    nombreVacuna: r.nombreVacuna,
    fechaAdministracion: r.fechaAdministracion.toISOString(),
    fechaProxima: r.fechaProxima?.toISOString() ?? "",
    lote: r.lote,
  }));

  const relatedTimeline: RelatedTimeline = historiaRaw
    ? { historia: [{ idHistoriaClinica: historiaRaw.idHistoriaClinica }] }
    : { historia: [] };

  const veterinariosRaw = await prisma.empleado.findMany({
  where: { deletedAt: null },
  select: {
    idEmpleado: true,
    usuario: {
      select: {
        nombre: true,
        apellido: true,
      },
    },
  },
});
  const relatedVacunacion: RelatedVacunacion = {
  mascotas: [{ idMascota, nombre: mascota.nombre }],
  veterinarios: veterinariosRaw.map((e) => ({
    idEmpleado: e.idEmpleado,
    nombre: e.usuario.nombre,
    apellido: e.usuario.apellido,
  })),
};

const historiaProp = historiaRaw
  ? {
      idHistoriaClinica: historiaRaw.idHistoriaClinica,
      idMascota,
      color: historiaRaw.color,
      tamaño: historiaRaw.tamaño,
      señalesParticulares: historiaRaw.señalesParticulares,
      finZootecnico: historiaRaw.finZootecnico,
      origenProcedencia: historiaRaw.origenProcedencia,
      alimentacion: historiaRaw.alimentacion,
      habitad: historiaRaw.habitad,
      viajesRecientes: historiaRaw.viajesRecientes,
      convivencia: historiaRaw.convivencia,
      comportamiento: historiaRaw.comportamiento,
      enfermedadPrevia: historiaRaw.enfermedadPrevia,
      partos: historiaRaw.partos,
      viveConAnimales: historiaRaw.viveConAnimales,
      previasEnfermedades: historiaRaw.previasEnfermedades.map((e) => ({
        id: e.id,
        descripcion: e.descripcion,
        fecha: e.fecha?.toISOString().slice(0, 10) ?? "",
      })),
      previasCirugias: historiaRaw.previasCirugias.map((c) => ({
        id: c.id,
        descripcion: c.descripcion,
        fecha: c.fecha?.toISOString().slice(0, 10) ?? "",
      })),
      tratamientosRecientes: historiaRaw.tratamientosRecientes.map((t) => ({
        id: t.id,
        descripcion: t.descripcion,
        fechaInicio: t.fechaInicio?.toISOString().slice(0, 10) ?? "",
        fechaFin: t.fechaFin?.toISOString().slice(0, 10) ?? "",
      })),
    }
  : null;

    return (
        <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
            <div className="w-full xl:w-2/3">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="bg-backgrounddefault py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image src={mascota.urlfoto || "/noAvatar.png"} alt="" width={144} height={144} className="w-36 h-36 rounded-full object-cover"/>
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <h1 className='text-xl font-semibold'> {mascota.nombre} </h1> 
                            <p className='text-sm text-gray-500'> Propietario: {mascota.propietario.nombre + ' ' +
                                mascota.propietario.apellido} ({mascota.propietario.dni})
                            </p>
                            <div className='flex items-center justify-between gap-2 flex-wrap text-xs font-medium'>
                                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <Calendar size={16} />
                                    <span>{new Date(mascota.fechaNacimiento).toLocaleDateString("es-PE", {
                                    timeZone: "UTC",
                                    })}</span>
                                </div>
                                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <ScanBarcode size={16} />
                                    <span>{mascota.numeroChip}</span>
                                </div>
                                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <Dog size={16} />
                                    <span>{mascota.raza}</span>
                                </div>
                                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <PawPrint size={16} />
                                    <span>{mascota.especie}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                            <Calendar size={24} className="text-gray-600" />
                            <div className=''>
                                <h1 className='text-xl font-semibold'>9</h1>
                                <span className='text-sm text-gray-500'>Número de consultas</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                            <Stethoscope size={24} className="text-gray-600" />
                            <div className=''>
                                <h1 className='text-xl font-semibold'>21/03/2025</h1>
                                <span className='text-sm text-gray-500'>Última consulta</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                            <CheckCircle size={24} className="text-gray-600" />
                            <div className=''>
                                <h1 className='text-xl font-semibold'>15/03/2025</h1>
                                <span className='text-sm text-gray-500'>Última desparasitación</span>
                            </div>
                        </div>

                    </div>
                </div>
               <div className="mt-4 bg-white rounded-md p-4 h-[550px] overflow-y-auto">
                {historiaRaw ? (
                  <TimelineSection
                    consultas={consultasParaCliente}
                    vacunaciones={vacunasParaCliente}
                    historiaId={historiaRaw.idHistoriaClinica}
                    mascotaId={mascota.idMascota}
                    relatedTimeline={relatedTimeline}
                    relatedVacunacion={relatedVacunacion}
                  />
                ) : (
                  <div className="p-6 text-center text-sm text-gray-600">
                    <p>No hay historia clínica todavía para esta mascota.</p>
                    <p className="mt-2">
                      Para registrar consultas y eventos, primero crea la historia clínica.
                    </p>
                  </div>
                )}
              </div>
            </div>

          <div className="w-full xl:w-1/3 flex flex-col gap-4">
            {historiaRaw ? (
              <Historia idMascota={mascota.idMascota} historia={historiaProp} />
            ) : (
              <div className="bg-white p-6 rounded-md border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">Historia clínica no encontrada</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Aún no existe una historia clínica para esta mascota. Puedes crearla para empezar a
                      registrar antecedentes, cirugías y tratamientos.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/historia/crear?mascotaId=${idMascota}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Crear historia clínica
                      </Link>

                      <Link
                        href={`/list/mascotas`}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Volver a mascotas
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
    )
}
