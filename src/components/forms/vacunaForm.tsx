"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InputField from "../inputField";
import {
  registroVacunacionSchema,
  RegistroVacunacionSchema,
} from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

import AutocompleteSelect, { OptionType } from "../autocompleteSelect";
import { createRegistroVacunacion, updateRegistroVacunacion } from "@/actions/vaccination.actions";

interface RegistroVacunacionFormProps {
  type: "create" | "update";
  data?: RegistroVacunacionSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    mascotas: { idMascota: number; nombre: string }[];
    veterinarios: { idEmpleado: number; nombre: string; apellido: string }[];
  };
  onSuccess?: (registro: any) => void;
}

export default function RegistroVacunacionForm({
  type,
  data,
  setOpen,
  relatedData,
  onSuccess,
}: RegistroVacunacionFormProps) {
  const idMascota = relatedData?.mascotas?.[0]?.idMascota;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistroVacunacionSchema>({
    resolver: zodResolver(registroVacunacionSchema),
    // defaultValues: {
    //   ...data,
    //   idMascota,
    // },
  });

  const mapOptions = <T,>(
    items: T[],
    idKey: keyof T,
    labelFn: (item: T) => string
  ): OptionType[] =>
    items.map((item) => ({
      value: String(item[idKey]),
      label: labelFn(item),
    }));

  const mascotaOptions = mapOptions(
    relatedData?.mascotas || [],
    "idMascota",
    (m: any) => m.nombre
  );
  const vetOptions = mapOptions(
    relatedData?.veterinarios || [],
    "idEmpleado",
    (v: any) => `${v.nombre} ${v.apellido}`
  );

  const [state, formAction] = useActionState(
    type === "create"
      ? createRegistroVacunacion
      : updateRegistroVacunacion,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    console.log('payload a enviar:', formData);
    console.log(relatedData)
    startTransition(() => {
      if (type === "update" && data?.idRegistroVacuna) {
        formAction({ ...formData, idRegistroVacuna: data.idRegistroVacuna });
      } else {
        formAction(formData);
      }
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showToast(
        "success",
        `El registro de vacunación ha sido ${
          type === "create" ? "creado" : "actualizado"
        }`
      );
      router.refresh();
      setOpen(false);
      onSuccess && onSuccess(data as any);
    } else if (state.error) {
      showToast("error", state.error);
      console.error("Error en la acción:", state.error);
    }
  }, [state, router, setOpen, type, onSuccess, data]);

  return (
    <form
      className="flex flex-col gap-6 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e as any);
      }}
    >

      <input
        type="hidden"
        {...register('idMascota')}
        value={idMascota}
      />

      <h2 className="text-xl font-semibold">
        {type === "create"
          ? "Nuevo registro de vacunación"
          : "Editar registro de vacunación"}
      </h2>

      {type === "update" && data?.idRegistroVacuna && (
        <InputField
          label="ID Registro"
          name="idRegistroVacuna"
          register={register}
          defaultValue={String(data.idRegistroVacuna)}
          hidden
        />
      )}

      <InputField
        label="Vacuna"
        name="nombreVacuna"
        register={register}
        error={errors.nombreVacuna}
        defaultValue={data?.nombreVacuna}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <InputField
          label="Fecha administración"
          name="fechaAdministracion"
          type="date"
          register={register}
          error={errors.fechaAdministracion}
          defaultValue={
            data?.fechaAdministracion
              ? new Date(data.fechaAdministracion)
                  .toISOString()
                  .slice(0, 10)
              : ""
          }
        />

        <InputField
          label="Fecha próxima"
          name="fechaProxima"
          type="date"
          register={register}
          error={errors.fechaProxima}
          defaultValue={
            data?.fechaProxima
              ? new Date(data.fechaProxima).toISOString().slice(0, 10)
              : ""
          }
        />
      </div>

      <InputField
        label="Lote"
        name="lote"
        register={register}
        error={errors.lote}
        defaultValue={data?.lote}
      />
      <button
        type="submit"
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
      >
        {type === "create" ? "Crear" : "Guardar"}
      </button>
    </form>
  );
};

