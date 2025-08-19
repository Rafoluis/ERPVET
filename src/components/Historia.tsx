"use client";

import { useState, startTransition, Dispatch, SetStateAction } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { createHistoriaClinica, updateHistoriaClinica } from "@/actions/historia.actions";
import {
  createEnfermedadPrevia,
  updateEnfermedadPrevia,
  deleteEnfermedadPrevia,
  createCirugiaPrevia,
  updateCirugiaPrevia,
  deleteCirugiaPrevia,
  createTratamientoReciente,
  updateTratamientoReciente,
  deleteTratamientoReciente,
} from "@/actions/historiaRelacionadas.actions";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface ItemFecha {
  id?: number;
  descripcion: string;
  fecha?: string;
}
interface TratamientoFecha {
  id?: number;
  descripcion: string;
  fechaInicio?: string;
  fechaFin?: string;
}

interface HistoriaProps {
  idMascota: number;
  historia: {
    idHistoriaClinica: number;
    idMascota: number;
    color: string;
    tamaño: string;
    señalesParticulares: string;
    finZootecnico: string;
    origenProcedencia: string;
    alimentacion: string;
    habitad: string;
    viajesRecientes: string;
    convivencia: string;
    comportamiento: string;
    enfermedadPrevia: string;
    partos: number;
    viveConAnimales: boolean;
    previasEnfermedades: ItemFecha[];
    previasCirugias: ItemFecha[];
    tratamientosRecientes: TratamientoFecha[];
  } | null;
}

export default function Historia({ idMascota, historia }: HistoriaProps) {
  const [localHistoria, setLocalHistoria] = useState(historia);
  const isNew = localHistoria === null;
  const router = useRouter();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [expandedGeneral, setExpandedGeneral] = useState(true);
  const [expandedAnamnesis, setExpandedAnamnesis] = useState(true);

  const [values, setValues] = useState({
    color: historia?.color || "",
    tamaño: historia?.tamaño || "",
    señalesParticulares: historia?.señalesParticulares || "",
    finZootecnico: historia?.finZootecnico || "",
    origenProcedencia: historia?.origenProcedencia || "",
    alimentacion: historia?.alimentacion || "",
    habitad: historia?.habitad || "",
    viajesRecientes: historia?.viajesRecientes || "",
    convivencia: historia?.convivencia || "",
    comportamiento: historia?.comportamiento || "",
    enfermedadPrevia: historia?.enfermedadPrevia || "",
    partos: historia?.partos ?? 0,
    viveConAnimales: historia?.viveConAnimales ?? false,
  });

  const [enfermedades, setEnfermedades] = useState<ItemFecha[]>(
    historia?.previasEnfermedades.map(e => ({
      id: e.id,
      descripcion: e.descripcion,
      fecha: e.fecha?.slice(0, 10) || "",
    })) || []
  );
  const [cirugias, setCirugias] = useState<ItemFecha[]>(
    historia?.previasCirugias.map(c => ({
      id: c.id,
      descripcion: c.descripcion,
      fecha: c.fecha?.slice(0, 10) || "",
    })) || []
  );
  const [tratamientos, setTratamientos] = useState<TratamientoFecha[]>(
    historia?.tratamientosRecientes.map(t => ({
      id: t.id,
      descripcion: t.descripcion,
      fechaInicio: t.fechaInicio?.slice(0, 10) || "",
      fechaFin: t.fechaFin?.slice(0, 10) || "",
    })) || []
  );

  const objectToFormData = (obj: Record<string, any>) => {
    const form = new FormData();
    Object.entries(obj).forEach(([k, v]) => form.append(k, String(v)));
    return form;
  };

  const handleSaveAll = async () => {
    try {
      let idHistoria: number;
      // Crear o actualizar historia
      if (isNew) {
        const resp = await createHistoriaClinica(
          { success: false, error: null },
          { idMascota, ...values }
        );
        if (!resp.success || !("idHistoriaClinica" in resp)) {
          throw new Error("No se pudo crear la historia clínica");
        }
        idHistoria = (resp as any).idHistoriaClinica;
        setLocalHistoria({
          idHistoriaClinica: idHistoria,
          idMascota,
          ...values,
          previasEnfermedades: [],
          previasCirugias: [],
          tratamientosRecientes: [],
        });
        showToast("success", "Historia creada");
      } else {
        idHistoria = localHistoria!.idHistoriaClinica;
        await updateHistoriaClinica(
          { success: false, error: null },
          { idHistoriaClinica: idHistoria, idMascota, ...values }
        );
        showToast("success", "Historia actualizada");
      }

      // Procesar enfermedades
      for (const e of enfermedades) {
        const data = {
          idHistoriaClinica: idHistoria,
          descripcion: e.descripcion,
          fecha: e.fecha ? new Date(e.fecha) : undefined,
        };
        if (e.id) {
          await updateEnfermedadPrevia(
            { success: false, error: null },
            { id: e.id, ...data }
          );
        } else {
          await createEnfermedadPrevia(
            { success: false, error: null },
            data
          );
        }
      }
      // Cirugías
      for (const c of cirugias) {
        const data = {
          idHistoriaClinica: idHistoria,
          descripcion: c.descripcion,
          fecha: c.fecha ? new Date(c.fecha) : undefined,
        };
        if (c.id) {
          await updateCirugiaPrevia(
            { success: false, error: null },
            { id: c.id, ...data }
          );
        } else {
          await createCirugiaPrevia(
            { success: false, error: null },
            data
          );
        }
      }
      // Tratamientos
      for (const t of tratamientos) {
        const data = {
          idHistoriaClinica: idHistoria,
          descripcion: t.descripcion,
          fechaInicio: t.fechaInicio ? new Date(t.fechaInicio) : undefined,
          fechaFin: t.fechaFin ? new Date(t.fechaFin) : undefined,
        };
        if (t.id) {
          await updateTratamientoReciente(
            { success: false, error: null },
            { id: t.id, ...data }
          );
        } else {
          await createTratamientoReciente(
            { success: false, error: null },
            data
          );
        }
      }

      // Finalmente refrescar
      startTransition(() => router.refresh());
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Error al guardar");
    }
  };

  const handleDelete = (
    idx: number,
    tipo: "enf" | "cir" | "trat",
    setter: Dispatch<SetStateAction<any[]>>
  ) => async () => {
    const items = tipo === "enf" ? enfermedades : tipo === "cir" ? cirugias : tratamientos;
    const item = items[idx];
    if (item.id) {
      const fn =
        tipo === "enf"
          ? deleteEnfermedadPrevia
          : tipo === "cir"
          ? deleteCirugiaPrevia
          : deleteTratamientoReciente;
      await fn({ success: false, error: null }, objectToFormData({ id: item.id }));
    }
    setter(prev => prev.filter((_, i) => i !== idx));
  };

  const renderField = (key: keyof typeof values, label: string) => {
    const val = (values as any)[key] as string;
    return (
      <div key={key} className="p-4 border rounded bg-white flex flex-col">
        <div className="flex justify-between items-center">
          <h3>{label}</h3>
          <Pencil size={16} className="cursor-pointer" onClick={() => setEditingField(key)} />
        </div>
        {editingField === key ? (
          <input
            className="mt-2 p-2 border rounded"
            defaultValue={val}
            onBlur={e => {
              setValues(v => ({ ...v, [key]: e.target.value }));
              setEditingField(null);
            }}
            autoFocus
          />
        ) : (
          <p className="mt-2 text-gray-600">{val}</p>
        )}
      </div>
    );
  };

  const renderDynamicList = (
    title: string,
    items: any[],
    onAdd: () => void,
    tipo: "enf" | "cir" | "trat",
    fields: string[]
  ) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium">{title}</h2>
        <button onClick={onAdd} className="p-1 bg-green-100 rounded hover:bg-green-200">
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {items.map((it: any, i: number) => (
          <div key={i} className="flex items-center gap-2 p-2 border rounded bg-white">
            {fields.map(f => (
              <input
                key={f}
                className="flex-1 p-1 border rounded"
                placeholder={f}
                defaultValue={it[f]}
                onBlur={e => {
                  it[f] = e.target.value;
                }}
              />
            ))}
            <button onClick={handleDelete(i, tipo, tipo === "enf" ? setEnfermedades : tipo === "cir" ? setCirugias : setTratamientos)}>
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 rounded-md space-y-6">
      <h1 className="text-xl font-semibold">Historia Clínica</h1>

      {/* Sección Datos Generales */}
      <section className="border rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => setExpandedGeneral(v => !v)}
          className="w-full flex justify-between p-4 bg-gray-100"
        >
          <span>Datos Generales</span>
          {expandedGeneral ? <ChevronDown /> : <ChevronRight />}
        </button>
        {expandedGeneral && (
          <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2">
            {renderField("color", "Color")}
            {renderField("tamaño", "Tamaño")}
            {renderField("señalesParticulares", "Señales Particulares")}
            {renderField("finZootecnico", "Fin Zootécnico")}
            {renderField("origenProcedencia", "Origen - Procedencia")}
          </div>
        )}
      </section>

      {/* Sección Anamnesis */}
      <section className="border rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => setExpandedAnamnesis(v => !v)}
          className="w-full flex justify-between p-4 bg-gray-100"
        >
          <span>Anamnesis</span>
          {expandedAnamnesis ? <ChevronDown /> : <ChevronRight />}
        </button>
        {expandedAnamnesis && (
          <div className="p-4 space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {renderField("alimentacion", "Alimentación")}
              {renderField("habitad", "Hábitat")}
              {renderField("viajesRecientes", "Viajes recientes")}
              {renderField("convivencia", "Convivencia")}
              {renderField("comportamiento", "Comportamiento")}
            </div>
            {renderDynamicList(
              "Enfermedades Previas",
              enfermedades,
              () => setEnfermedades(p => [...p, { descripcion: "", fecha: "" }]),
              "enf",
              ["descripcion", "fecha"]
            )}
            {renderDynamicList(
              "Cirugías Previas",
              cirugias,
              () => setCirugias(p => [...p, { descripcion: "", fecha: "" }]),
              "cir",
              ["descripcion", "fecha"]
            )}
            {renderDynamicList(
              "Tratamientos Recientes",
              tratamientos,
              () => setTratamientos(p => [...p, { descripcion: "", fechaInicio: "", fechaFin: "" }]),
              "trat",
              ["descripcion", "fechaInicio", "fechaFin"]
            )}
          </div>
        )}
      </section>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isNew ? "Crear historia clínica" : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
