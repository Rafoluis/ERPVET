"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { propietarioSchema, PropietarioSchema } from "@/lib/formSchema";
import { startTransition, useActionState, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createPropietario, updatePropietario } from "@/actions/propietario.actions";

interface PropietarioFormProps {
    type: "create" | "update";
    data?: PropietarioSchema;
    setOpen: (open: boolean) => void;
    onSuccess?: (prop: any) => void;
    relatedData?: {
    mascotas: { idMascota: number; nombre: string }[];
    };
}

const PropietarioForm = ({ type, data, setOpen, onSuccess,relatedData }: PropietarioFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropietarioSchema>({
    resolver: zodResolver(propietarioSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createPropietario : updatePropietario,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    startTransition(async () => {
      try {
        const result = await formAction(formData) as any;
        let payload: any = null;
        if (result && result.created) {
          payload = result.created;
        } else if (result && (result.idPropietario || result.id)) {
          payload = result;
        }
        if (!payload) {
          try {
            const stored = sessionStorage.getItem("lastCreatedPropietario");
            if (stored) payload = JSON.parse(stored);
          } catch (e) {
            console.warn("No se pudo leer lastCreatedPropietario:", e);
          }
        }
        if (payload && (payload.idPropietario || payload.id)) {
          const normalized = {
            idPropietario: payload.idPropietario ?? payload.id,
            nombre: payload.nombre ?? `${payload.nombre ?? ""} ${payload.apellido ?? ""}`.trim(),
            ...payload,
          };

          try {
            window.dispatchEvent(new CustomEvent("propietarioCreated", { detail: normalized }));
          } catch (e) {
            console.warn("dispatch propietarioCreated falló:", e);
          }

          try {
            sessionStorage.setItem("lastCreatedPropietario", JSON.stringify(normalized));
          } catch (e) {
            console.warn("guardar lastCreatedPropietario falló:", e);
          }

          if (onSuccess) onSuccess(normalized);
        } else {
          if (onSuccess) onSuccess(formData);
        }
      } catch (err) {
        console.error("Error creando propietario (formAction):", err);
      }
    });


  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showToast("success", `El propietario fue ${type === "create" ? "creado" : "actualizado"}`);
      router.refresh();
      setOpen(false);
    } else if (state.error) {
      showToast("error", "Algo salió mal");
      console.error("Error en la acción: ", state.error);
    }
  }, [state, router, setOpen, type]);

  return (
  <form
    className="flex flex-col gap-6 p-4"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit(e as any);
    }}
  >
    <h1 className="text-xl font-semibold">
      {type === "create" ? "Registrar Propietario" : "Actualizar Propietario"}
    </h1>

    {data && (
      <InputField
        label="ID Propietario"
        name="idPropietario"
        defaultValue={String(data.idPropietario)}
        register={register}
        error={errors.idPropietario}
        hidden
      />
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {relatedData?.mascotas && relatedData.mascotas.length > 0 && (
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Mascotas asociadas</label>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {relatedData.mascotas.map((mascota) => (
              <li key={mascota.idMascota}>{mascota.nombre}</li>
            ))}
          </ul>
        </div>
      )}

      <InputField
        label="DNI"
        name="dni"
        defaultValue={data?.dni?.toString()}
        register={register}
        error={errors.dni}
        type="number"
        fullWidth
      />

      <InputField
        label="Nombre"
        name="nombre"
        defaultValue={data?.nombre}
        register={register}
        error={errors.nombre}
        fullWidth
      />

      <InputField
        label="Apellido"
        name="apellido"
        defaultValue={data?.apellido}
        register={register}
        error={errors.apellido}
        fullWidth
      />

      <InputField
        label="Correo"
        name="correo"
        defaultValue={data?.correo}
        register={register}
        error={errors.correo}
        type="email"
        fullWidth
      />

      <InputField
        label="Teléfono"
        name="telefono"
        defaultValue={data?.telefono}
        register={register}
        error={errors.telefono}
        fullWidth
      />

      <InputField
        label="Dirección"
        name="direccion"
        defaultValue={data?.direccion}
        register={register}
        error={errors.direccion}
        fullWidth
      />
    </div>
      <button
        type="submit"
        className="bg-backbuttondefault hover:bg-backhoverbutton text-white py-2 rounded-md"
      >
        {type === "create" ? "Crear" : "Actualizar"}
      </button>
    </form>
  );
};

export default PropietarioForm;
