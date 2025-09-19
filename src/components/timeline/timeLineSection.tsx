'use client';

import { useState } from 'react';
import FormModal from '../formModal';
import TimelineSwitcher, { Consulta, VaccineRecord } from './timeLineSwitcher';

export interface RelatedTimeline {
  historia: { idHistoriaClinica: number }[];
}
export interface RelatedVacunacion {
  mascotas: { idMascota: number; nombre: string }[];
  veterinarios: { idEmpleado: number; nombre: string; apellido: string }[];
}

interface Props {
  consultas: Consulta[];
  vacunaciones: VaccineRecord[];
  historiaId: number;
  mascotaId: number;
  relatedTimeline: RelatedTimeline;
  relatedVacunacion: RelatedVacunacion;
}

export default function TimelineSection({
  consultas,
  vacunaciones,
  historiaId,
  mascotaId,
  relatedTimeline,
  relatedVacunacion,
}: Props) {
  const [mode, setMode] = useState<'consultas' | 'vacunacion'>('consultas');
  const [editItem, setEditItem] = useState<Consulta | VaccineRecord | null>(null);

  return (
    <div>
      <h2 className="text-xl mb-4">
        Historial de {mode === 'consultas' ? 'consultas' : 'vacunas'}
      </h2>

      {/* Botón "Agregar" usa su propio trigger interno */}
      <div className="mb-6 flex justify-end">
        <FormModal
          key={mode}
          table={mode === 'consultas' ? 'timeline' : 'vacunacion'}
          type="create"
          id={mode === 'consultas' ? historiaId : mascotaId}
          relatedData={mode === 'consultas' ? relatedTimeline : relatedVacunacion}
          onSuccess={() => {}}
        />
      </div>

      {/* Modal de edición (sin trigger interno) */}
      {editItem && (
        <FormModal
          key={
            mode === 'consultas'
              ? `update-timeline-${(editItem as Consulta).id}`
              : `update-vacuna-${(editItem as VaccineRecord).idRegistroVacuna}`
          }
          table={mode === 'consultas' ? 'timeline' : 'vacunacion'}
          type="update"
          id={
            mode === 'consultas'
              ? (editItem as Consulta).id
              : (editItem as VaccineRecord).idRegistroVacuna
          }
          data={editItem}
          relatedData={mode === 'consultas' ? relatedTimeline : relatedVacunacion}
          onSuccess={() => setEditItem(null)}
          onClose={() => setEditItem(null)}     // <-- importante: limpiar al cerrar
          hideTrigger={true}
        />
      )}

      <TimelineSwitcher
        mode={mode}
        consultas={consultas}
        vacunaciones={vacunaciones}
        onModeChange={setMode}
        onEdit={setEditItem}
      />
    </div>
  );
}
