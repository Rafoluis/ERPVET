import FormContainer from "@/components/formContainer";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import TableSearch from "@/components/tableSearch";
import prisma from "@/lib/prisma";
import { numPage } from "@/lib/settings";
import { Mascota, Propietario, Prisma } from "@prisma/client";
import Image from "next/image";
import { Eye } from "lucide-react";
import Link from "next/link";

type MascotaList = Mascota & {
  propietario: Propietario;
};

const columns = [
  { header: "Nombre Mascota", accessor: "nombre" },
  { header: "Raza", accessor: "raza", className: "hidden md:table-cell" },
  { header: "Especie", accessor: "especie", className: "hidden md:table-cell" },
  { header: "Propietario", accessor: "propietario.nombre", className: "hidden lg:table-cell" },
  { header: "Fecha Nacimiento", accessor: "fechaNacimiento", className: "hidden md:table-cell" },
  { header: "Fecha Registro", accessor: "fechaCreacion", className: "hidden lg:table-cell" },
  { header: "Acciones", accessor: "acciones" },
];

const renderRow = (item: MascotaList) => {
  return (
    <tr
      key={item.idMascota}
      className="border-b border-gray-300 even:bg-backcolumtable text-sm hover:bg-tablehover"
    >
      {/* Foto y Nombre */}
      <td className="flex items-center gap-4 p-2">
        <Image
          src={item.urlfoto || "/noAvatar.png"}
          alt="Foto mascota"
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.nombre}</h3>
        </div>
      </td>

      {/* Raza */}
      <td className="hidden md:table-cell p-2">{item.raza ?? "-"}</td>

      {/* Especie */}
      <td className="hidden md:table-cell p-2">{item.especie}</td>

      {/* Propietario */}
      <td className="hidden lg:table-cell p-2">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.propietario.nombre} {item.propietario.apellido}
          </h3>
          <p className="text-xs text-gray-500">{item.propietario.dni}</p>
        </div>
      </td>

      {/* Fecha de nacimiento */}
      <td className="hidden md:table-cell p-2">
        {item.fechaNacimiento
          ? new Date(item.fechaNacimiento).toLocaleDateString("es-PE", { timeZone: "UTC" })
          : "-"}
      </td>

      {/* Fecha de registro */}
      <td className="hidden lg:table-cell p-2">
        {item.fechaCreacion
          ? new Date(item.fechaCreacion).toLocaleDateString("es-PE", { timeZone: "UTC" })
          : "-"}
      </td>

      {/* Acciones */}
      <td className="p-2">
        <div className="flex items-center gap-2">
          <Link href={`/list/mascotas/${item.idMascota}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-backbuttonsecondary hover:bg-backbuttonhover">
              <Eye size={18} color="black" />
            </button>
          </Link>
          <FormContainer table="mascota" type="update" data={item} />
          <FormContainer table="mascota" type="delete" id={item.idMascota} />
        </div>
      </td>
    </tr>
  );
};

const MascotaListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, sort, column, start, end, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Base where
  const where: Prisma.MascotaWhereInput = { deletedAt: null };

  const rawSearch = (params.search ?? "").trim();
  if (rawSearch) {
    const terms = rawSearch.split(/\s+/).filter(Boolean);

    const orConditions: Prisma.MascotaWhereInput[] = [
      { nombre: { contains: rawSearch, mode: "insensitive" } },
      { propietario: { nombre: { contains: rawSearch, mode: "insensitive" } } },
      { propietario: { apellido: { contains: rawSearch, mode: "insensitive" } } },
    ];

    if (terms.length >= 2) {
      orConditions.push({
        propietario: {
          AND: [
            { nombre: { contains: terms[0], mode: "insensitive" } },
            { apellido: { contains: terms[1], mode: "insensitive" } },
          ],
        },
      });
      orConditions.push({
        propietario: {
          AND: [
            { nombre: { contains: terms[1], mode: "insensitive" } },
            { apellido: { contains: terms[0], mode: "insensitive" } },
          ],
        },
      });
    }

    (where as any).OR = orConditions;
  }

  if (start || end) {
    (where as any).fechaCreacion = {
      gte: start ? new Date(start) : undefined,
      lte: end ? new Date(end) : undefined,
    };
  }

  const [data, count] = await prisma.$transaction([
    prisma.mascota.findMany({
      where,
      include: {
        propietario: true,
      },
      orderBy: column
        ? { [column as keyof Mascota]: sort === "asc" ? "asc" : "desc" }
        : undefined,
      take: numPage,
      skip: numPage * (p - 1),
    }),
    prisma.mascota.count({ where }),
  ]);

  return (
    <div>
      <div className="rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between p-2">
          <h1 className="hidden md:block text-lg font-semibold">Gestión de Mascotas</h1>
        </div>
      </div>

      <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between">
          <h2 className="hidden md:block text-ls font-semibold">Mascotas</h2>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <FormContainer table="mascota" type="create" />
            </div>
          </div>
        </div>

        <Table columns={columns} renderRow={renderRow} data={data} />

        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default MascotaListPage;
