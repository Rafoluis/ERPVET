"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../inputField";

const schema = z.object({
    paciente: z.string().min(1, { message: "Paciente requerido" }),
    fecha: z.date({ message: "Fecha requerida" }),
    horaInicio: z.number({ message: "Hora requerida" }),
    horaFinal: z.number({ message: "Hora requerida" }),
    servicio: z.enum(["Limpieza dental", "Consulta", "Extracción"], { message: "Servicio requerido" }),
    tarifaServicio: z.number().min(1, { message: "Servicio requerido" }),
    doctorAsignado: z.enum(["Jose Luis", "Pedro Paramo"], { message: "Doctor requerido" }),
    descripcion: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const CitaForm = ({
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
                    {...register("paciente")}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("paciente")}
                    defaultValue={data?.paciente}
                />
                {errors.paciente?.message && <p className="text-xs text-red-500">{errors.paciente?.message.toString()}</p>}
            </div>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Fecha de cita"
                    name="fecha"
                    defaultValue={data?.fecha}
                    register={register}
                    error={errors.fecha}
                    type="date"
                />
                <InputField
                    label="Hora Inicial"
                    name="horaInicio"
                    defaultValue={data?.horaCita}
                    register={register}
                    error={errors.horaInicio}
                />
                <InputField
                    label="Hora Final"
                    name="horaFinal"
                    defaultValue={data?.horaCita}
                    register={register}
                    error={errors.horaFinal}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Servicio</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("servicio")} defaultValue={data?.servicio || ""}>
                        <option value="" disabled>Seleccionar</option>
                        <option value="Limpieza dental">Limpieza dental</option>
                        <option value="Consulta">Consulta</option>
                        <option value="Extracción">Extracción</option>
                    </select>
                    {errors.servicio?.message && <p className="text-xs text-red-500">{errors.servicio?.message.toString()}</p>}
                </div>
                <InputField
                    label="Tarifa"
                    name="tarifa"
                    defaultValue={data?.paciente}
                    register={register}
                    error={errors.paciente}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Doctor Asignado</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("doctorAsignado")} defaultValue={data?.doctorAsignado || ""}>
                        <option value="" disabled>Seleccionar</option>
                        <option value="Jose Luis">Jose Luis</option>
                        <option value="Pedro Paramo">Pedro Paramo</option>
                    </select>
                    {errors.doctorAsignado?.message && <p className="text-xs text-red-500">{errors.doctorAsignado?.message.toString()}</p>}
                </div>
                <InputField
                    label="Descripcion"
                    name="descripcion"
                    defaultValue={data?.descripcion}
                    register={register}
                    error={errors.descripcion}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default CitaForm