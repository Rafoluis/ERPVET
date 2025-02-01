"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { createAppointment, updateAppointment } from "@/actions/appointment.actions";
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
        { success: false, error: null }
    );

    const onSubmit = handleSubmit((data) => {

        if (data.hora_cita_final) {
            const baseDate = data.fecha_cita ? new Date(data.fecha_cita) : new Date();
            const [hours, minutes] = data.hora_cita_final.split(":").map(Number);
            baseDate.setHours(hours, minutes, 0, 0);
            const dateWithTimezone = new Date(baseDate.getTime() - 5 * 60 * 60 * 1000);
            data.hora_cita_final = dateWithTimezone.toISOString();
        } else {
            data.hora_cita_final = undefined;
        }

        console.log("Form submitted with modified data", data);

        // Form action call
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
            toast("Error en la acción: " + state.error);
            console.error("Error en la acción:", state.error);
        }
    }, [state]);

    const { pacientes, empleados, servicios } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nueva cita" : "Actualizar cita"}
            </h1>

            {/* Input oculto para Id */}
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

            {/* Selección de Paciente y Odontólogo */}
            <div className="grid grid-cols-1  gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Paciente</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_paciente")}
                        defaultValue={type === "create" ? "" : data?.id_paciente}
                    >
                        <option value="" disabled className="text-textdark">
                            Seleccione
                        </option>
                        {pacientes.map((paciente: { id_paciente: number; nombre: string; apellido: string }) => (
                            <option value={paciente.id_paciente} key={JSON.stringify(paciente)}>
                                {paciente.nombre} {paciente.apellido}
                            </option>
                        ))}
                    </select>
                    {errors.id_paciente?.message && (
                        <p className="text-xs text-red-400">{errors.id_paciente.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Odontólogo</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_empleado")}
                        defaultValue={type === "create" ? "" : data?.id_empleado}
                    >
                        <option value="" disabled className="text-textdark">
                            Seleccione
                        </option>
                        {empleados.map((empleado: { id_empleado: number; nombre: string; apellido: string }) => (
                            <option value={empleado.id_empleado} key={JSON.stringify(empleado)}>
                                {empleado.nombre} {empleado.apellido}
                            </option>
                        ))}
                    </select>
                    {errors.id_empleado?.message && (
                        <p className="text-xs text-red-400">{errors.id_empleado.message.toString()}</p>
                    )}
                </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <InputField
                        label="Fecha y hora de cita"
                        name="fecha_cita"
                        defaultValue={
                            data?.fecha_cita
                                ? new Date(data.fecha_cita)
                                    .toLocaleString("sv-SE", { timeZone: "America/Lima" })
                                    .replace(" ", "T")
                                : ""
                        }
                        register={register}
                        error={errors.fecha_cita}
                        type="datetime-local"
                    />
                </div>

                <div className="flex flex-col gap-2 w-1/3">
                    <InputField
                        label="Hora Final"
                        name="hora_cita_final"
                        defaultValue={
                            data?.hora_cita_final
                                ? new Date(data.hora_cita_final).toISOString().slice(11, 16)
                                : ""
                        }
                        register={register}
                        error={errors.hora_cita_final}
                        type="time"
                    />
                </div>
            </div>

            {/* Servicio y Tarifa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Servicio</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_servicio")}
                        defaultValue={type === "create" ? "" : data?.id_servicio}
                    >
                        <option value="" disabled className="text-textdark">
                            Seleccione
                        </option>
                        {servicios.map((servicio: { id_servicio: number; nombre_servicio: string; tarifa: number }) => (
                            <option value={servicio.id_servicio} key={JSON.stringify(servicio)}>
                                {servicio.nombre_servicio}
                            </option>
                        ))}
                    </select>
                    {errors.id_servicio?.message && (
                        <p className="text-xs text-red-400">{errors.id_servicio.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-1/3">
                    <InputField
                        label="Tarifa"
                        name="serviceFee"
                        defaultValue={data?.servicio.tarifa}
                        register={register}
                    // error={errors.id_servicio}
                    />
                </div>
            </div>

            {/* Estado */}
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
                    <p className="text-xs text-red-400">{errors.estado.message.toString()}</p>
                )}
            </div>

            {state.error && <span className="text-red-400">Algo pasó mal</span>}
            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form>

    );
};

export default AppointmentForm

