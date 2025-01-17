"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { createAppointment } from "@/lib/serverActions";
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

    const [state, formAction] = useActionState(createAppointment,
        //type === "create" ? createAppointment : createAppointment,
        { success: false, error: false }
    );

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`La cita a sido ${type === "create" ? "creada" : "actualizada"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state]);


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nueva cita" : "Actualizar cita"}
            </h1>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-xs text-gray-500">Paciente</label>
                <input type={type}
                    {...register("patient")}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("patient")}
                    defaultValue={data?.paciente.nombre}
                />
                {errors.patient?.message && <p className="text-xs text-red-500">{errors.patient?.message.toString()}</p>}
            </div>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Fecha de cita"
                    name="date"
                    defaultValue={data?.fecha_cita}
                    register={register}
                    error={errors.date}
                    type="date"
                />
                <InputField
                    label="Hora Inicial"
                    name="startTime"
                    defaultValue={data?.horaInicio}
                    register={register}
                    error={errors.startTime}
                />
                <InputField
                    label="Hora Final"
                    name="endTime"
                    defaultValue={data?.horaFinal}
                    register={register}
                    error={errors.endTime}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Servicio</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("service")} defaultValue={data?.servicio || ""}>
                        <option value="" disabled>Seleccionar</option>
                        <option value="Limpieza dental">Limpieza dental</option>
                        <option value="Consulta">Consulta</option>
                        <option value="Extracción">Extracción</option>
                    </select>
                    {errors.service?.message && <p className="text-xs text-red-500">{errors.service?.message.toString()}</p>}
                </div>
                <InputField
                    label="Tarifa"
                    name="serviceFee"
                    defaultValue={data?.servicio.tarifa}
                    register={register}
                    error={errors.serviceFee}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Doctor Asignado</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("assignedDoctor")} defaultValue={data?.doctorAsignado || ""}>
                        <option value="" disabled>Seleccionar</option>
                        <option value="Jose Luis">Jose Luis</option>
                        <option value="Pedro Paramo">Pedro Paramo</option>
                    </select>
                    {errors.assignedDoctor?.message && <p className="text-xs text-red-500">{errors.assignedDoctor?.message.toString()}</p>}
                </div>
                <InputField
                    label="Descripcion"
                    name="descripcion"
                    defaultValue={data?.descripcion}
                    register={register}
                    error={errors.note}
                />
            </div>
            {state.error && <span className="text-red-400"> Algo paso mal </span>}
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default AppointmentForm