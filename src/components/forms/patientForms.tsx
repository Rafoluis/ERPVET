"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { createAppointment, createPatient, updateAppointment, updatePatient } from "@/lib/serverActions";
import { patientSchema, PatientSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const PatientForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PatientSchema>({
        resolver: zodResolver(patientSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createPatient : updatePatient,
        { success: false, error: false }
    );

    const onSubmit = handleSubmit((data) => {

        console.log("Fecha UTC enviada:", data);

        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`El paciente ha sido ${type === "create" ? "creado" : "actualizado"}`);
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            console.error("Error en la acción:", state.error);
        }
    }, [state]);

    //const {} = relatedData;

    const formatDateToLocalString = (date: Date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nuevo paciente" : "Actualizar paciente"}
            </h1>
            {data && (
                <InputField
                    label="Id"
                    name="id_paciente"
                    defaultValue={data?.id_paciente}
                    register={register}
                    error={errors?.id_paciente}
                    hidden
                />
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Nombre del paciente"
                    name="nombre"
                    defaultValue={data?.nombre}
                    register={register}
                    error={errors.nombre}
                />

                <InputField
                    label="Apellido del paciente"
                    name="apellido"
                    defaultValue={data?.apellido}
                    register={register}
                    error={errors?.apellido}
                />

                <InputField
                    label="DNI"
                    name="dni"
                    defaultValue={data?.dni}
                    register={register}
                    error={errors.dni}
                />

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Servicio</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sexo")}
                        defaultValue={data?.sexo}
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
                <InputField
                    label="Fecha de nacimiento"
                    name="fecha_nacimiento"
                    defaultValue={data?.fecha_nacimiento.toISOString().split("T")[0]}
                    register={register}
                    error={errors.fecha_nacimiento}
                    type="date"
                />
                <InputField
                    label="Dirección"
                    name="direccion"
                    defaultValue={data?.direccion}
                    register={register}
                    error={errors?.direccion}
                />
                <InputField
                    label="Teléfono"
                    name="telefono"
                    defaultValue={data?.telefono}
                    register={register}
                    error={errors?.telefono}
                />
            </div>

            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default PatientForm