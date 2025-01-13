"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../inputField";

const schema = z.object({
    patient: z.string().min(1, { message: "Paciente requerido" }),
    date: z.date({ message: "Fecha requerida" }),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato de hora HH:mm incorrecto" }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato de hora HH:mm incorrecto" }),
    service: z.enum(["Limpieza dental", "Consulta", "Extracción"], { message: "Servicio requerido" }),
    serviceFee: z.number().min(1, { message: "Servicio requerido" }),
    assignedDoctor: z.enum(["Jose Luis", "Pedro Paramo"], { message: "Doctor requerido" }),
    note: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const AppointmentForm = ({
    type,
    data,
}: {
    type: "create" | "update";
    data?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(data => {
        console.log(data);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Registrar Cita</h1>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-xs text-gray-500">Paciente</label>
                <input type={type}
                    {...register("patient")}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("patient")}
                    defaultValue={data?.paciente}
                />
                {errors.patient?.message && <p className="text-xs text-red-500">{errors.patient?.message.toString()}</p>}
            </div>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Fecha de cita"
                    name="fecha"
                    defaultValue={data?.fecha}
                    register={register}
                    error={errors.date}
                    type="date"
                />
                <InputField
                    label="Hora Inicial"
                    name="horaInicio"
                    defaultValue={data?.horaInicio}
                    register={register}
                    error={errors.startTime}
                />
                <InputField
                    label="Hora Final"
                    name="horaFinal"
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
                    name="tarifa"
                    defaultValue={data?.tarifaServicio}
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
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default AppointmentForm