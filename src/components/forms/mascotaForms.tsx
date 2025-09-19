"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InputField from "../inputField";
import { mascotaSchema, MascotaSchema } from "@/lib/formSchema";
import { startTransition, useActionState, useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createMascota, updateMascota } from "@/actions/mascota.actions";
import AutocompleteSelect, { OptionType } from "../autocompleteSelect";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

type RelatedData = {
  propietarios?: { idPropietario: number; nombre: string }[];
  mascotas?: { idMascota: number; nombre: string }[];
  veterinarios?: { idEmpleado: number; nombre: string; apellido: string }[];
};

interface MascotaFormProps {
  type: "create" | "update";
  data?: MascotaSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: RelatedData;
  onSuccess?: (mascota: any) => void;
}

export default function MascotaForm({
  type,
  data,
  setOpen,
  relatedData,
  onSuccess,
}: MascotaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MascotaSchema>({
    resolver: zodResolver(mascotaSchema),
  });

  const [localRelatedData, setLocalRelatedData] = useState<RelatedData | undefined>(relatedData);
  const [showPropietarioModal, setShowPropietarioModal] = useState<boolean>(false);
  const [state, formAction] = useActionState(
    type === "create" ? createMascota : updateMascota,
    { success: false, error: null }
  );
  const [img, setImg] = useState<any>();
  const router = useRouter();

  const handleNewPropietario = (newProp: { idPropietario: number; nombre: string }) => {
  if (!newProp) return;
  setLocalRelatedData((prev) => {
    const current = prev?.propietarios ?? [];
    if (current.some((p) => p.idPropietario === newProp.idPropietario)) return prev;
    return {
      ...(prev ?? {}),
      propietarios: [{ idPropietario: newProp.idPropietario, nombre: newProp.nombre }, ...current],
    };
  });

  setValue("idPropietario", newProp.idPropietario as any);

  setShowPropietarioModal(false);
};

  useEffect(() => {
    if (!localRelatedData) {
      (async () => {
        try {
          const res = await fetch("/api/related?table=mascota&type=create");
          if (res.ok) {
            const json = await res.json();
            setLocalRelatedData(json);
          } else {
            console.error("Error fetching relatedData:", await res.text());
          }
        } catch (err) {
          console.error("Error fetching relatedData:", err);
        }
      })();
    }
  }, [localRelatedData]);

  const propietarioOptions: OptionType[] =
    (localRelatedData?.propietarios ?? []).map((p) => ({
      value: String(p.idPropietario),
      label: p.nombre,
    })) ?? [];

  // Submit
  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction({ ...formData, img: img?.secure_url });
    });
  });

  useEffect(() => {
    if (state.success) {
      showToast("success", `La mascota ha sido ${type === "create" ? "creada" : "actualizada"}`);
      router.refresh();
      setOpen(false);
      onSuccess && onSuccess(data as any);
    } else if (state.error) {
      showToast("error", state.error);
      console.error("Error en la acción: ", state.error);
    }
  }, [state, router, setOpen, type, onSuccess, data]);

  useEffect(() => {
    const onPropietarioCreated = (ev: Event) => {
      try {
        const custom = ev as CustomEvent;
        const newProp = custom.detail as { idPropietario: number; nombre: string };

        if (!newProp || !newProp.idPropietario) return;
        setLocalRelatedData((prev) => {
          const current = prev?.propietarios ?? [];
          if (current.some((p) => p.idPropietario === newProp.idPropietario)) return prev;
          return {
            ...(prev ?? {}),
            propietarios: [{ idPropietario: newProp.idPropietario, nombre: newProp.nombre }, ...current],
          };
        });

        setValue("idPropietario", newProp.idPropietario as any);
      } catch (err) {
        console.error("Error manejando propietarioCreated:", err);
      }
    };

    window.addEventListener("propietarioCreated", onPropietarioCreated as EventListener);

    try {
      const stored = sessionStorage.getItem("lastCreatedPropietario");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.idPropietario) {
          // llamar al handler directamente
          onPropietarioCreated(new CustomEvent("propietarioCreated", { detail: parsed }));
          sessionStorage.removeItem("lastCreatedPropietario");
        }
      }
    } catch (err) {
      console.warn("Error leyendo lastCreatedPropietario:", err);
    }

    // Cleanup
    return () => {
      window.removeEventListener("propietarioCreated", onPropietarioCreated as EventListener);
    };
  }, [setValue, setLocalRelatedData]);


  return (
    <form
      className="flex flex-col gap-8 p-2 overflow-y-auto max-h-[calc(100vh-4rem)]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e as any);
      }}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Registrar nueva mascota" : "Actualizar mascota"}
      </h1>

      {data && (
        <InputField
          label="ID Mascota"
          name="idMascota"
          defaultValue={String(data.idMascota)}
          register={register}
          error={errors.idMascota}
          hidden
        />
      )}

      {/* Propietario (Autocomplete) */}
      <Controller
        control={control}
        name="idPropietario"
        defaultValue={data?.idPropietario as any}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Propietario</label>
            <AutocompleteSelect
              options={propietarioOptions}
              value={propietarioOptions.find((opt) => opt.value === String(field.value)) || null}
              onChange={(opt) => field.onChange(opt ? Number(opt.value) : undefined)}
              label={""}
            />

            {errors.idPropietario && <p className="text-xs text-red-500">{errors.idPropietario.message}</p>}
          </div>
        )}
      />

      {/* Resto de inputs */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nombre"
          name="nombre"
          defaultValue={data?.nombre}
          register={register}
          error={errors.nombre}
        />

        <InputField
          label="Especie"
          name="especie"
          defaultValue={data?.especie}
          register={register}
          error={errors.especie}
        />

        <InputField
          label="Raza"
          name="raza"
          defaultValue={data?.raza}
          register={register}
          error={errors.raza}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm font-medium">Sexo</label>
          <select
            {...register("sexo")}
            defaultValue={data?.sexo ?? ""}
            className="border border-gray-300 p-2 rounded-md text-sm w-full focus:outline-none"
          >
            <option value="" disabled>Seleccione</option>
            <option value="MACHO">MACHO</option>
            <option value="HEMBRA">HEMBRA</option>
          </select>
          {errors.sexo && (
            <p className="text-xs text-red-500">{errors.sexo.message}</p>
          )}
        </div>


        <InputField
          label="Fecha de nacimiento"
          name="fechaNacimiento"
          type="date"
          defaultValue={
            data?.fechaNacimiento
              ? new Date(data.fechaNacimiento).toISOString().slice(0, 10)
              : ""
          }
          register={register}
          error={errors.fechaNacimiento}
        />

        <InputField
          label="Peso (kg)"
          name="peso"
          type="number"
          defaultValue={data?.peso?.toString()}
          register={register}
          error={errors.peso}
        />

        <InputField
          label="Número de Chip"
          name="numeroChip"
          defaultValue={data?.numeroChip}
          register={register}
          error={errors.numeroChip}
        />

        <InputField
          label="Alergias"
          name="alergias"
          defaultValue={data?.alergias}
          register={register}
          error={errors.alergias}
        />

        <InputField
          label="Notas de Comportamiento"
          name="notasComportamiento"
          defaultValue={data?.notasComportamiento}
          register={register}
          error={errors.notasComportamiento}
        />

        {/* Upload imagen */}
        <div className="flex flex-col gap-2 w-full md:w-1/4 px-4 py-2">
          <CldUploadWidget
            uploadPreset="veterinaria"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/upload.png" alt="" width={28} height={28} />
                  <span>Sube una foto</span>
                </div>
              );
            }}
          </CldUploadWidget>

          {/* preview si subiste una imagen */}
          {img?.secure_url && (
            <div className="mt-2">
              <img src={img.secure_url} alt="preview" className="w-24 h-24 object-cover rounded" />
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="bg-backbuttondefault hover:bg-backhoverbutton text-white py-2 rounded-md">
        {type === "create" ? "Crear" : "Actualizar"}
      </button>
    </form>
  );
}
