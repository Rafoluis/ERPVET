'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Stethoscope, Pencil, ChevronRight } from 'lucide-react';

export interface Consulta {
  id: number;
  fecha: string;       // ISO string
  titulo: string;
  ubicacion: string;
  descripcion: string;
  detalles: string[];
}
export interface VaccineRecord {
  idRegistroVacuna: number;
  nombreVacuna: string;
  fechaAdministracion: string; // ISO string
  fechaProxima: string;        // ISO string
}

interface Props {
  mode: 'consultas' | 'vacunacion';
  consultas: Consulta[];
  vacunaciones: VaccineRecord[];
  onModeChange: (m: 'consultas' | 'vacunacion') => void;
  onEdit: (item: Consulta | VaccineRecord) => void;
}

export default function TimelineSwitcher({
  mode,
  consultas,
  vacunaciones,
  onModeChange,
  onEdit,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange('consultas')}
          className={`flex-1 px-4 py-2 rounded ${
            mode === 'consultas' ? 'bg-cyan-500 text-white' : 'bg-gray-100'
          }`}
        >
          <Stethoscope className="inline mr-1" /> Consultas
        </button>
        <button
          onClick={() => onModeChange('vacunacion')}
          className={`flex-1 px-4 py-2 rounded ${
            mode === 'vacunacion' ? 'bg-green-500 text-white' : 'bg-gray-100'
          }`}
        >
          Vacunación
        </button>
      </div>
      {/* Listado */}
      {mode === 'consultas' ? (
        consultas.length === 0 ? (
          <p className="text-center text-gray-500">Sin consultas registradas.</p>
        ) : (
          consultas.map((c) => (
            <div key={c.id} className="p-4 border rounded bg-white space-y-2 relative">
              <button
                className="absolute top-2 right-2 bg-sky-200 p-2 rounded-full hover:bg-sky-300"
                onClick={() => onEdit(c)}
              >
                <Pencil size={16} className="text-gray-700" />
              </button>
              <div className="text-sm text-gray-600">
                {format(new Date(c.fecha), 'dd MMM yyyy', { locale: es })}
              </div>
              <h3 className="text-lg font-semibold">{c.titulo}</h3>
              <p className="text-sm">{c.descripcion}</p>
              <div className="flex flex-wrap gap-1">
                {c.detalles.map((d, i) => {
                  let label = '';
                  let fecha: string | undefined;

                  if (typeof d === 'string') {
                    try {
                      const parsed = JSON.parse(d);
                      label = parsed?.name ?? String(d);
                      fecha = parsed?.fecha;
                    } catch {
                      label = d;
                    }
                  } else if (typeof d === 'object' && d !== null) {
                    label = (d as any).name ?? String(d);
                    fecha = (d as any).fecha;
                  } else {
                    label = String(d);
                  }

                  return (
                    <span
                      key={i}
                      title={fecha ? format(new Date(fecha), 'dd/MM/yyyy') : undefined}
                      className="bg-sky-200 rounded-full px-2 py-0.5 text-xs"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        )
      ) : vacunaciones.length === 0 ? (
        <p className="text-center text-gray-500">Sin registros de vacunación.</p>
      ) : (
        vacunaciones.map((v) => (
          <div key={v.idRegistroVacuna} className="p-4 border rounded bg-white space-y-3 relative">
            <button
              className="absolute top-2 right-2 bg-sky-200 p-2 rounded-full hover:bg-sky-300"
              onClick={() => onEdit(v)}
            >
              <Pencil size={16} className="text-gray-700" />
            </button>
            <div className="text-sm text-gray-600">
              {format(new Date(v.fechaAdministracion), 'dd MMM yyyy', { locale: es })}
            </div>
            <h3 className="text-lg font-semibold">{v.nombreVacuna}</h3>
            <div className="flex items-center gap-2">
              <div className="bg-sky-100 px-2 py-1 rounded text-sm text-gray-700">
                Adm: {format(new Date(v.fechaAdministracion), 'dd/MM/yyyy')}
              </div>
              <ChevronRight className="text-gray-400" />
              <div className="bg-sky-100 px-2 py-1 rounded text-sm text-gray-700">
                Próx: {format(new Date(v.fechaProxima), 'dd/MM/yyyy')}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
