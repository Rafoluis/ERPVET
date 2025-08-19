"use client";
import { useState, useEffect } from "react";
import FormModal from "./formModal";

export type FormContainerProps = {
  table: "mascota" | "propietario" | "empleado" | "timeline" | "vacunacion";
  type: "create" | "update" | "delete" | "view";
  data?: any;
  id?: number | string;
};

export default function FormContainer({ table, type, data, id }: FormContainerProps) {
  const [relatedData, setRelatedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/related", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, type, data, id }),
    })
      .then((r) => r.json())
      .then((res) => setRelatedData(res))
      .catch((err) => {
        console.error("fetch related-data failed:", err);
        setRelatedData(null);
      })
      .finally(() => setLoading(false));
  }, [table, type, data, id]);

  if (loading) return <p>Cargando…</p>;
  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={relatedData}
    />
  );
}
