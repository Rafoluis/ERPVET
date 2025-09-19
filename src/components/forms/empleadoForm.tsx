"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { empleadoSchema, EmpleadoSchema } from "@/lib/formSchema";
import { startTransition, useActionState, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createEmpleado, updateEmpleado } from "@/actions/empleado.actions";

interface EmpleadoFormProps {
  type: "create" | "update";
  data?: EmpleadoSchema;
  setOpen: (open: boolean) => void;
  onSuccess?: (empleado: any) => void;
  relatedData?: any;
}

const EmpleadoForm = ({ type, data, setOpen, onSuccess, relatedData }: EmpleadoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpleadoSchema>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: data ? (data as any) : undefined,
  });

  const [state, formAction] = useActionState(
    type === "create" ? createEmpleado : updateEmpleado,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    startTransition(async () => {
      try {
        const result = (await formAction(formData)) as any;
        let payload: any = null;

        if (result && result.created) {
          payload = result.created;
        } else if (result && (result.idEmpleado || result.id)) {
          payload = result;
        }

        if (!payload) {
          try {
            const stored = sessionStorage.getItem("lastCreatedEmpleado");
            if (stored) payload = JSON.parse(stored);
          } catch (e) {
            console.warn("No se pudo leer lastCreatedEmpleado:", e);
          }
        }

        if (payload && (payload.idEmpleado || payload.id || payload.empleado?.idEmpleado)) {
          // Normalizar payload a una forma coherente
          const normalized = {
            idEmpleado: payload.idEmpleado ?? payload.id ?? payload.empleado?.idEmpleado,
            nombre: payload.nombre ?? `${payload.nombre ?? ""} ${payload.apellido ?? ""}`.trim(),
            apellido: payload.apellido ?? "",
            email: payload.email ?? "",
            telefono: payload.telefono ?? "",
            ...payload,
          };

          try {
            window.dispatchEvent(new CustomEvent("empleadoCreated", { detail: normalized }));
          } catch (e) {
            console.warn("dispatch empleadoCreated falló:", e);
          }

          try {
            sessionStorage.setItem("lastCreatedEmpleado", JSON.stringify(normalized));
          } catch (e) {
            console.warn("guardar lastCreatedEmpleado falló:", e);
          }

          if (onSuccess) onSuccess(normalized);
        } else {
          if (onSuccess) onSuccess(formData);
        }
      } catch (err) {
        console.error("Error en formAction empleado:", err);
      }
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showToast("success", `El empleado fue ${type === "create" ? "creado" : "actualizado"}`);
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
        {type === "create" ? "Registrar Empleado" : "Actualizar Empleado"}
      </h1>

      {data && (
        <InputField
          label="ID Empleado"
          name="idEmpleado"
          defaultValue={String((data as any).idEmpleado)}
          register={register}
          error={errors.idEmpleado as any}
          hidden
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="DNI"
          name="dni"
          defaultValue={(data as any)?.dni?.toString?.()}
          register={register}
          error={errors.dni}
          type="number"
          fullWidth
        />

        <InputField
          label="Nombre"
          name="nombre"
          defaultValue={(data as any)?.nombre}
          register={register}
          error={errors.nombre}
          fullWidth
        />

        <InputField
          label="Apellido"
          name="apellido"
          defaultValue={(data as any)?.apellido}
          register={register}
          error={errors.apellido}
          fullWidth
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium">Sexo</label>
          <select
            {...register("sexo")}
            defaultValue={(data as any)?.sexo ?? ""}
            className="border border-gray-300 p-2 rounded-md text-sm w-full focus:outline-none"
          >
            <option value="" disabled>
              Seleccione sexo
            </option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
          </select>
          {errors.sexo && <p className="text-xs text-red-500">{(errors.sexo as any)?.message}</p>}
        </div>

        <InputField
          label="Correo"
          name="email"
          defaultValue={(data as any)?.email}
          register={register}
          error={errors.email}
          type="email"
          fullWidth
        />

        <InputField
          label="Teléfono"
          name="telefono"
          defaultValue={(data as any)?.telefono}
          register={register}
          error={errors.telefono as any}
          fullWidth
        />

        <InputField
          label="Dirección"
          name="direccion"
          defaultValue={(data as any)?.direccion}
          register={register}
          error={errors.direccion as any}
          fullWidth
        />

        <InputField
          label="Especialidad"
          name="especialidad"
          defaultValue={(data as any)?.especialidad}
          register={register}
          error={errors.especialidad as any}
          fullWidth
        />

        <InputField
          label={type === "create" ? "Contraseña" : "Contraseña (dejar en blanco para no cambiar)"}
          name="password"
          defaultValue={""}
          register={register}
          error={errors.password as any}
          type="password"
          fullWidth
        />
      </div>

      <button type="submit" className="bg-backbuttondefault hover:bg-backhoverbutton text-white py-2 rounded-md">
        {type === "create" ? "Crear" : "Actualizar"}
      </button>
    </form>
  );
};

export default EmpleadoForm;
