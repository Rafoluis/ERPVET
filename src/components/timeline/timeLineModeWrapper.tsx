// TimelineModeWrapper.tsx
'use client';
import { Stethoscope} from 'lucide-react';
import { JSX } from 'react';
import { Consulta, VaccineRecord } from './timeLineSwitcher';
import RegistroVacunacionForm from '../forms/vacunaForm';

interface Props {
  historiaId: number;
  mascotaId: number;
  mode: 'consultas' | 'vacunacion';
  consultas: Consulta[];
  vacunaciones: VaccineRecord[];
}

const consultaIconMap: Record<string, JSX.Element> = {
  consulta: <Stethoscope className="w-8 h-8 p-1 rounded-lg text-white" />,
};

export default function TimelineModeWrapper({
  mode,
  consultas,
  vacunaciones,
}: Props) {
  if (mode === 'vacunacion') {
    return (
      <RegistroVacunacionForm
        type="create"
        relatedData={{ mascotas: [], veterinarios: [] }}
        setOpen={() => {}}
      />
    );
  }
  return (
    <div>
      {consultas.map((item, i) => {
        const Icon = Stethoscope;
        const dateStr = new Date(item.fecha).toLocaleDateString('es-PE', { timeZone: 'UTC' });
        return (
          <div key={i} className="flex flex-col sm:flex-row m-4 relative">
            <div className="hidden sm:flex items-start w-56 pt-1 relative">
              <div className="w-4/5 text-gray-500">{dateStr}</div>
              <div className="bg-cyan-500 w-px h-full translate-x-5 translate-y-10 opacity-30" />
              <Icon className="bg-cyan-500 w-12 h-10 p-1 rounded-lg z-20 text-white" />
              <div className="bg-cyan-500 h-px w-8 translate-y-5 opacity-30" />
            </div>
            <div className="border border-gray-600 rounded-lg px-8 py-4 bg-sky-50 w-full text-center z-10 sm:w-96">
              <div className="text-xl font-medium">{item.titulo}</div>
              <div className="text-gray-600 mb-6 sm:mb-8 sm:text-xs">
                {item.descripcion}
                <span className="sm:hidden"> | {dateStr}</span>
              </div>
              <div className="text-sm mb-4 text-left">{item.descripcion}</div>
              <div className="flex flex-wrap mb-6 justify-center">
                {item.detalles.map((d, idx) => (
                  <span key={idx} className="bg-sky-200 rounded-xl px-2 py-1 text-sm m-1">
                    {d}
                  </span>
                ))}
              </div>
              <Icon className="bg-cyan-500 w-8 p-1 rounded-lg z-20 absolute left-4 top-4 sm:hidden text-white" />
              <a className="bg-cyan-500 text-gray-950 text-sm px-4 py-1 rounded-md mx-auto cursor-pointer text-white hover:text-white hover:bg-backhoverbutton">
                Ver Detalles
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
