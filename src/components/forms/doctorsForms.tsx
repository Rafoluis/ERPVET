"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { doctorSchema, DoctorSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createDoctor, updateDoctor } from "@/actions/doctor.actions";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface DoctorFormProps {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
    onSuccess?: (doctor: any) => void;
}

const DoctorForm = ({ type, data, setOpen, onSuccess }: DoctorFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DoctorSchema>({
        resolver: zodResolver(doctorSchema),
    });

    const [submittedData, setSubmittedData] = useState<any>(null);
    const [state, formAction] = useActionState(
        type === "create" ? createDoctor : updateDoctor,
        { success: false, error: null }
    );

    const actionText = type === "create" ? "creado" : "actualizado";

    const onSubmit = handleSubmit((formData) => {
        setSubmittedData(formData);
        startTransition(() => {
            formAction(formData);
        });
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            showToast("success", `El doctor ha sido ${actionText}`);
            router.refresh();
            setOpen(false);
        } else if (state.error) {
            showToast("error", "Algo pasó mal");
            console.error("Error en la acción: ", state.error);
        }
    }, [state, router, setOpen, actionText]);

    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={(e) => {
                e.stopPropagation();
                onSubmit(e);
            }}
        >
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nuevo doctor" : "Actualizar doctor"}
            </h1>
            {data && (
                <InputField
                    label="Id"
                    name="id_empleado"
                    defaultValue={data?.id_empleado}
                    register={register}
                    error={errors?.id_empleado}
                    hidden
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primer columna */}
                <InputField
                    label="Nombre"
                    name="nombre"
                    defaultValue={data?.usuario?.nombre}
                    register={register}
                    error={errors.nombre}
                />
                <InputField
                    label="Apellido"
                    name="apellido"
                    defaultValue={data?.usuario?.apellido}
                    register={register}
                    error={errors?.apellido}
                />
                <InputField
                    label="DNI"
                    name="dni"
                    defaultValue={data?.usuario?.dni}
                    register={register}
                    error={errors.dni}
                />
                <InputField
                    label="Teléfono"
                    name="telefono"
                    defaultValue={data?.usuario?.telefono}
                    register={register}
                    error={errors?.telefono}
                />
                <InputField
                    label="Email"
                    name="email"
                    defaultValue={data?.usuario?.email}
                    register={register}
                    error={errors.email}
                />
                {/* Segunda columna */}
                <InputField
                    label="Dirección"
                    name="direccion"
                    defaultValue={data?.usuario?.direccion}
                    register={register}
                    error={errors.direccion}
                />
                <InputField
                    label="Contraseña"
                    name="password"
                    type="password"
                    defaultValue={data?.usuario?.password}
                    register={register}
                    error={errors.password}
                />
                <InputField
                    label="Especialidad"
                    name="especialidad"
                    defaultValue={data?.especialidad}
                    register={register}
                    error={errors.especialidad}
                />
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Sexo</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sexo")}
                        defaultValue={data?.usuario?.sexo}
                    >
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                    </select>
                    {errors.sexo?.message && (
                        <p className="text-xs text-red-400">
                            {errors.sexo.message.toString()}
                        </p>
                    )}
                </div>
            </div>
            {state.error && <span className="text-red-400">Algo pasó mal</span>}
            <button type="submit" className="bg-backbuttondefault text-white p-2 rounded-md">
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form>
    );
};

export default DoctorForm;