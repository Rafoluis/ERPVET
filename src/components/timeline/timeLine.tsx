import { Stethoscope, ShieldPlus, HeartPulse } from "lucide-react";
import prisma from "@/lib/prisma";
import { EventType } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface TimelineElement {
  id: number;
  date: string;
  icon: "consultation" | "checkup" | "surgery";
  color: string;
  title: string;
  location: string;
  description: string;
  detalles: string[];
}

interface TimelineProps {
  defaultColor?: string;
}

const iconMap: Record<Exclude<EventType, "VACUNACION">, { name: TimelineElement["icon"]; Component: any }> = {
  CONSULTA_INICIAL: { name: "consultation", Component: Stethoscope },
  CHEQUEO_SEGUIMIENTO: { name: "checkup",   Component: ShieldPlus },
  CIRUGIA_ESTERILIZACION: { name: "surgery",   Component: HeartPulse },
};

export default async function Timeline({
  defaultColor = "bg-cyan-500",
}: TimelineProps) {
  const rows = await prisma.lineaTiempo.findMany({
    where: { deletedAt: null },
    orderBy: { fechaCreacion: "asc" },
  });

  const elements: TimelineElement[] = rows.map((r) => {
    const mapEntry = iconMap[r.tipo];
    const IconComponent = mapEntry.Component;
    return {
      id: r.id,
      date: format(r.fechaCreacion, "dd MMM yyyy", { locale: es }),
      icon: mapEntry.name,
      color: defaultColor,
      title: r.titulo,
      location: r.ubicacion,
      description: r.descripcion,
      detalles: r.detalles,
    };
  });

  return (
    <div>
      {elements.map((el) => {
        const Icon = iconMap[rows.find(r => r.id === el.id)!.tipo].Component;

        return (
          <div key={el.id} className="flex flex-col sm:flex-row m-4 relative">
            <div className="hidden sm:flex items-start w-56 pt-1 relative">
              <div className="w-4/5 text-gray-500">{el.date}</div>
              <div className={`${el.color} w-px h-full translate-x-5 translate-y-10 opacity-30`} />
              <Icon className={`${el.color} w-12 h-10 p-1 rounded-lg z-20 text-white`} />
              <div className={`${el.color} h-px w-8 translate-y-5 opacity-30`} />
            </div>
            <div className="border border-gray-600 rounded-lg px-8 py-4 bg-sky-50 w-full text-center z-10 sm:w-96">
              <div className="text-xl font-medium">{el.title}</div>
              <div className="text-gray-600 mb-6 sm:mb-8 sm:text-xs">
                {el.location}
                <span className="sm:hidden"> | {el.date}</span>
              </div>
              <div className="text-sm mb-4 text-left">{el.description}</div>
              <div className="flex flex-wrap mb-6 justify-center">
                {el.detalles.map((d, i) => (
                  <span key={i} className="bg-sky-200 rounded-xl px-2 py-1 text-sm m-1">
                    {d}
                  </span>
                ))}
              </div>
              <Icon className={`${el.color} w-8 p-1 rounded-lg z-20 absolute left-4 top-4 sm:hidden text-white`} />

              <a
                className={`${el.color} text-gray-950 text-sm px-4 py-1 rounded-md mx-auto cursor-pointer text-white hover:text-white hover:bg-backhoverbutton`}
              >
                Ver Detalles
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
