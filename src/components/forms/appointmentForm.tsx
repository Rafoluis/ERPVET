"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { createAppointment, updateAppointment } from "@/lib/serverActions";
import { appointmentSchema, AppointmentSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AppointmentForm = ({
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
    } = useForm<AppointmentSchema>({
        resolver: zodResolver(appointmentSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createAppointment : updateAppointment,
        { success: false, error: false }
    );

    const onSubmit = handleSubmit((data) => {
        console.log("Formulario enviado", data);
        startTransition(() => {
            formAction(data);
        });
    });


    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`La cita ha sido ${type === "create" ? "creada" : "actualizada"}`);
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            console.error("Error en la acción:", state.error);
        }
    }, [state]);

    const { pacientes, empleados, servicios } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nueva cita" : "Actualizar cita"}
            </h1>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-xs text-gray-500">Paciente</label>

                <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("id_paciente")}
                    defaultValue={data?.id_paciente}
                >
                    {pacientes.map((paciente: { id_paciente: number; nombre: string; apellido: string }) => (
                        <option value={paciente.id_paciente} key={paciente.id_paciente}>
                            {paciente.nombre + " " + paciente.apellido}
                        </option>
                    ))}
                </select>
                {errors.id_paciente?.message && (
                    <p className="text-xs text-red-400">
                        {errors.id_paciente.message.toString()}
                    </p>
                )}
            </div>
            {data && (
                <InputField
                    label="Id"
                    name="id_cita"
                    defaultValue={data?.id_cita}
                    register={register}
                    error={errors?.id_cita}
                    hidden
                />
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Fecha y hora de cita"
                    name="fecha_cita"
                    defaultValue={
                        data?.fecha_cita
                            ? new Date(new Date(data.fecha_cita).toLocaleString("en-US", { timeZone: "America/Lima" }))
                                .toISOString()
                                .slice(0, 16)
                            : ""
                    }
                    //defaultValue={data?.fecha_cita ? new Date(data.fecha_cita).toISOString().slice(0, 16) : ""}
                    //defaultValue={data?.fecha_cita.toISOString().split("T")[0]}
                    //defaultValue={data?.fecha_cita}
                    //defaultValue={data?.fecha_cita && new Date(data.fecha_cita).toLocaleDateString('en-CA')}
                    register={register}
                    error={errors.fecha_cita}
                    type="datetime-local"
                />

                <InputField
                    label="Hora Final"
                    name="hora_cita_final"
                    defaultValue={data?.hora_cita_final}
                    register={register}
                    error={errors.hora_cita_final}
                    type="datetime-local"
                />

                <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <label className="text-xs text-gray-500">Servicio</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_servicio")}
                        defaultValue={data?.id_servicio}
                    >
                        {servicios.map((servicio: { id_servicio: number; nombre_servicio: string; tarifa: number }) => (
                            <option value={servicio.id_servicio} key={servicio.id_servicio}>
                                {servicio.nombre_servicio + " " + servicio.tarifa}
                            </option>
                        ))}
                    </select>
                    {errors.id_servicio?.message && (
                        <p className="text-xs text-red-400">
                            {errors.id_servicio.message.toString()}
                        </p>
                    )}
                    {<InputField
                        label="Tarifa"
                        name="serviceFee"
                        defaultValue={data?.servicio.tarifa}
                        register={register}

                    />}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <label className="text-xs text-gray-500">Odontólogo</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_empleado")}
                        defaultValue={data?.id_empleado}
                    >
                        {empleados.map((empleado: { id_empleado: number; nombre: string; apellido: string }) => (
                            <option value={empleado.id_empleado} key={empleado.id_empleado}>
                                {empleado.nombre + " " + empleado.apellido}
                            </option>
                        ))}
                    </select>
                    {errors.id_empleado?.message && (
                        <p className="text-xs text-red-400">
                            {errors.id_empleado.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <label className="text-xs text-gray-500">Estado</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("estado")}
                        defaultValue={data?.estado}
                    >
                        <option value="AGENDADO">Agendado</option>
                        <option value="COMPLETADO">Completado</option>
                        <option value="EN_PROCESO">En proceso</option>
                        <option value="FINALIZADO">Finalizado</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                    {errors.estado?.message && (
                        <p className="text-xs text-red-400">
                            {errors.estado.message.toString()}
                        </p>
                    )}
                </div>
            </div>
            {state.error && <span className="text-red-400"> Algo paso mal </span>}
            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default AppointmentForm