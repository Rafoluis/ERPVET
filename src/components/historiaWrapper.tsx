"use client";

import { useState } from "react";
import Link from "next/link";
import Historia from "@/components/Historia";

interface Props {
  idMascota: number;
  initialHistoria: any | null;
}

export default function HistoriaWrapper({ idMascota, initialHistoria }: Props) {
  // si ya hay historia, la mostramos; si no, estado para mostrar editor al pulsar
  const [showEditor, setShowEditor] = useState<boolean>(Boolean(initialHistoria));

  return (
    <div className="w-full xl:w-1/3 flex flex-col gap-4">
      {showEditor ? (
        // pasar initialHistoria (puede ser null) para que Historia detecte isNew
        <Historia idMascota={idMascota} historia={initialHistoria} />
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
                {/* botón que simplemente muestra el componente Historia en lugar de navegar */}
                <button
                  type="button"
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Crear historia clínica
                </button>

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
  );
}
