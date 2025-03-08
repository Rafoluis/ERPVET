"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { serviceSchema, ServiceSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createService, updateService } from "@/actions/service.actions";
import { showToast } from "@/lib/toast";

const ServiceForm = ({
    type,
    data,
    setOpen,
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
    } = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createService : updateService,
        { success: false, error: null }
    );

    const onSubmit = handleSubmit((formData) => {
        console.log("Datos enviados:", formData);
        startTransition(() => {
            formAction(formData);
        });
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            showToast("success", `El servicio ha sido ${type === "create" ? "creado" : "actualizado"}`);
            // toast(
            //     `El servicio ha sido ${type === "create" ? "creado" : "actualizado"}`
            // );
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            showToast("error", "Algo salió mal, inténtalo de nuevo");
            // toast("Error en la acción: " + state.error);
            console.error("Error en la acción: ", state.error);
        }
    }, [state]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create"
                    ? "Registrar nuevo servicio"
                    : "Actualizar servicio"}
            </h1>
            {data && (
                <InputField
                    label="Id"
                    name="id_servicio"
                    defaultValue={data?.id_servicio}
                    register={register}
                    error={errors?.id_servicio}
                    hidden
                />
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Nombre del servicio"
                    name="nombre_servicio"
                    defaultValue={data?.nombre_servicio}
                    register={register}
                    error={errors.nombre_servicio}
                />
                <InputField
                    label="Descripción"
                    name="descripcion"
                    defaultValue={data?.descripcion}
                    register={register}
                    error={errors.descripcion}
                />
                <InputField
                    label="Tarifa"
                    name="tarifa"
                    defaultValue={data?.tarifa}
                    register={register}
                    error={errors.tarifa}
                    type="number"
                />
            </div>
            {state.error && <span className="text-red-400"> Algo pasó mal </span>}
            <button
                type="submit"
                className="bg-backbuttondefault text-white p-2 rounded-md"
            >
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form>
    );
};

export default ServiceForm;
