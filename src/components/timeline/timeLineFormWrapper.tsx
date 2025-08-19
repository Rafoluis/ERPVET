'use client';

import dynamic from "next/dynamic";

const TimelineForm = dynamic(() => import('../forms/timeLineForm'), { ssr: false });
const VacunacionForm = dynamic(() => import('../forms/vacunaForm'), { ssr: false });

export default function TimelineFormWrapper({
  mode,
  relatedTimeline,
  relatedVacunacion,
}: {
  mode: "consultas" | "vacunacion";
  historiaId: number;
  mascotaId: number;
  relatedTimeline: any;
  relatedVacunacion: any;
  setOpen: (open: boolean) => void;
}) {
  if (mode === "consultas") {
    return (
      <TimelineForm
        type="create"
        relatedData={relatedTimeline}
        setOpen={() => {}}
        onSuccess={() => {}}
      />
    );
  } else {
    return (
      <VacunacionForm
        type="create"
        relatedData={relatedVacunacion}
        setOpen={() => {}}
        onSuccess={() => {}}
      />
    );
  }
}
