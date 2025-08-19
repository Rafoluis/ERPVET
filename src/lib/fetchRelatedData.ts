// src/lib/fetchRelatedData.ts
import prisma from "@/lib/prisma";

export const fetchRelatedData = async (
  table: string,
  type: string,
  data?: any,
  id?: number | string
) => {
  if (type === "delete") return {};

  switch (table) {
    case "mascota":
      return await fetchMascotaData();

    case "propietario":
      if (!id) return {};
      const mascotas = await prisma.mascota.findMany({
        where: { idPropietario: Number(id) },
        select: { idMascota: true, nombre: true },
      });
      return { mascotas };

    case "timeline":
      return { historia: [{ idHistoriaClinica: Number(id) }] };

    case "vacunacion":
      const idNum = Number(id);
      const mascota = await prisma.mascota.findUnique({
        where: { idMascota: idNum },
        select: { idMascota: true, nombre: true },
      });
      return {
        mascotas: mascota ? [mascota] : [],
        veterinarios: await prisma.empleado.findMany(),
      };

    default:
      return {};
  }
};

/* --- simple in-memory cache --- */
let _fetchMascotaCache: { value: any; ts: number } | null = null;
const CACHE_TTL_MS = 3600 * 1000; // 1 hora

async function fetchMascotaDataUncached() {
  const propietarios = await prisma.propietario.findMany({
    where: { deletedAt: null },
    select: { idPropietario: true, nombre: true, apellido: true },
  });
  return {
    propietarios: propietarios.map((p) => ({
      idPropietario: p.idPropietario,
      nombre: `${p.nombre} ${p.apellido}`,
    })),
  };
}

async function fetchMascotaData() {
  if (_fetchMascotaCache && Date.now() - _fetchMascotaCache.ts < CACHE_TTL_MS) {
    return _fetchMascotaCache.value;
  }
  const value = await fetchMascotaDataUncached();
  _fetchMascotaCache = { value, ts: Date.now() };
  return value;
}
