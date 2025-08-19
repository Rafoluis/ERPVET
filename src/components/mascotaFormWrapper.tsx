// src/components/forms/MascotaFormWrapper.tsx
import React from "react";
import { fetchRelatedData } from "@/lib/fetchRelatedData";
import type { MascotaSchema } from "@/lib/formSchema";
import MascotaForm from "./forms/mascotaForms";

interface Props {
  type: "create" | "update";
  data?: MascotaSchema;
  historiaId?: number;
  mascotaId?: number;
}

export default async function MascotaFormWrapper({ type, data, historiaId, mascotaId }: Props) {
  // server-side fetch
  const relatedData = await fetchRelatedData("mascota", type);

  // Render client component and pase relatedData como prop
  return (
    // MascotaForm es Client Component (usa hooks), así que está bien recibir datos serializables
    <MascotaForm type={type} data={data} setOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error("Function not implemented.");
      } }/>
  );
}
