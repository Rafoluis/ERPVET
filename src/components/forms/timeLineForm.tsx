"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch} from "react-hook-form";
import InputField from "../inputField";
import { timelineSchema, TimeLineSchema } from "@/lib/formSchema";
import { startTransition, useActionState, useState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { EventType } from "@prisma/client";
import {
  createLineaTiempo,
  updateLineaTiempo,
} from "@/actions/timeLine.actions";
import { Plus } from "lucide-react";

interface TimeLineFormProps {
  type: "create" | "update";
  relatedData: { historia: { idHistoriaClinica: number }[] };
  data?: TimeLineSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const DETAIL_OPTIONS: Record<EventType, string[]> = {
  CIRUGIA_ESTERILIZACION: ["Preanestesia", "Anestesia", "Postoperatorio"],
  CHEQUEO_SEGUIMIENTO: ["Signos Vitales", "Peso", "Examen Físico"],
  CONSULTA_INICIAL: ["Antecedentes", "Peso", "Temperatura"],
};

const DEFAULT_TITLES: Record<EventType, string> = {
  CIRUGIA_ESTERILIZACION: "Cirugía de Esterilización",
  CHEQUEO_SEGUIMIENTO: "Chequeo de Seguimiento",
  CONSULTA_INICIAL: "Consulta Inicial",
};

export default function TimeLineForm({
  type,
  relatedData,
  data,
  setOpen,
  onSuccess,
}: TimeLineFormProps) {
  const isNew = type === "create";
  const router = useRouter();

  const idHistoriaClinica = relatedData?.historia?.[0]?.idHistoriaClinica;

  const defaultValues: TimeLineSchema = isNew
    ? {
        idHistoriaClinica,
        tipo: Object.values(EventType)[0],
        titulo: "",
        ubicacion: "Clínica Vet, Lima",
        descripcion: "",
        detalles: [],
      }
    : (data as TimeLineSchema);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TimeLineSchema>({
    resolver: zodResolver(timelineSchema),
    defaultValues,
  });

  const watchedTipo = useWatch({ control, name: "tipo" }) as EventType | undefined;
  useEffect(() => {
    if (watchedTipo) {
      setValue("titulo", DEFAULT_TITLES[watchedTipo]);
      if (isNew) {
        setDetailItems([]);
        setValue("detalles", []);
      }
    }
  }, [watchedTipo, setValue, isNew]);


  const handleAddDetail = () => {
    if (!selectedDetail || !selectedDate) return;
    const newItem = { name: selectedDetail, fecha: selectedDate };
    const newItems = [...detailItems, newItem];
    setDetailItems(newItems);
    setSelectedDetail("");
    setSelectedDate("");
  };



  const [state, formAction] = useActionState(
    isNew ? createLineaTiempo : updateLineaTiempo,
    { success: false, error: null }
  );

  const [detailItems, setDetailItems] = useState<
    { name: string; fecha: string }[]
  >([]);
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const onSubmit = (formData: TimeLineSchema) => {
    startTransition(() => {
      formAction(isNew ? formData : { ...formData, id: data!.id });
    });
  };

  useEffect(() => {
    if (state.success) {
      showToast("success", isNew ? "Evento agregado" : "Evento actualizado");
      setOpen(false);
      router.refresh();
      onSuccess?.();
    } else if (state.error) {
      showToast("error", state.error);
    }
  }, [state, router, setOpen, onSuccess, isNew]);

  useEffect(() => {
    if (!isNew && data) {
      reset(data);
      if ((data as any).tipo) {
        setValue("tipo", (data as any).tipo);
      }
      const mapped = (data.detalles ?? []).map((d: any) => {
        if (typeof d === "string") {
          try {
            const p = JSON.parse(d);
            return { name: p.name ?? d, fecha: p.fecha ?? "" };
          } catch {
            return { name: d, fecha: "" };
          }
        }
        // si viene objeto
        return { name: d.name ?? String(d), fecha: d.fecha ?? "" };
      });
      setDetailItems(mapped);
      setValue("detalles", mapped.map((m) => JSON.stringify(m)));
    }
  }, [isNew, data, reset, setValue]);

  useEffect(() => {
    // Mantén el campo detalles consistente con detailItems (guardamos JSON strings)
    setValue("detalles", detailItems.map((d) => JSON.stringify(d)));
  }, [detailItems, setValue]);


  const detalleOptions = watchedTipo ? DETAIL_OPTIONS[watchedTipo] : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
      <h2 className="text-xl font-semibold">
        {isNew ? "Agregar evento" : "Editar evento"}
      </h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium">Tipo de evento</label>
        <select
          {...register("tipo")}
          defaultValue={defaultValues.tipo}
          className="border p-2 rounded"
        >
          <option value="" disabled>
            Seleccione un tipo
          </option>
          {Object.values(EventType).map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
      </div>
        
      <InputField
        label="Título"
        name="titulo"
        register={register}
        error={errors.titulo}
        defaultValue={defaultValues.titulo}
        fullWidth
      />

      <InputField
        label="Ubicación"
        name="ubicacion"
        register={register}
        defaultValue={defaultValues.ubicacion}
        error={errors.ubicacion}
        fullWidth
      />

      <div className="flex flex-col">
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          {...register("descripcion")}
          defaultValue={defaultValues.descripcion}
          rows={3}
          className="border p-2 rounded"
        />
        {errors.descripcion && (
          <p className="text-xs text-red-500">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-sm block">Detalle</label>
            <select
              value={selectedDetail}
              onChange={(e) => setSelectedDetail(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione un detalle</option>
              {detalleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm block">Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleAddDetail}
            disabled={!selectedDetail || !selectedDate}
            className={`flex items-center gap-1 px-3 py-2 rounded text-white ${
              selectedDetail && selectedDate
                ? "bg-backbuttondefault"
                : "bg-gray-400"
            }`}
          >
            <Plus size={16} /> Agregar detalle
          </button>
        </div>

        {detailItems.length > 0 && (
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-2 py-1">Detalle</th>
                  <th className="px-2 py-1">Fecha</th>
                  <th className="px-2 py-1">Acción</th>
                </tr>
              </thead>
              <tbody>
                {detailItems.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-1">{d.name}</td>
                    <td className="px-2 py-1">
                      <input
                        type="date"
                        value={d.fecha}
                        onChange={(e) => {
                          const arr = [...detailItems];
                          arr[i].fecha = e.target.value;
                          setDetailItems(arr);
                        }}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button
                        type="button"
                        onClick={() =>
                          setDetailItems((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        className="text-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {errors.detalles && (
          <p className="text-xs text-red-500">
            {errors.detalles.message}
          </p>
        )}
      </div>

      <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">
        {isNew ? "Crear" : "Guardar"}
      </button>
    </form>
  );
}
