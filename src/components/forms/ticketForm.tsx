"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { TicketSchema, ticketSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createTicket, updateTicket } from "@/actions/ticket.actions";

const TicketForm = ({
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
        setValue,
        formState: { errors },
    } = useForm<TicketSchema>({
        resolver: zodResolver(ticketSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createTicket : updateTicket,
        { success: false, error: null }
    );

    const [citas, setCitas] = useState<any[]>([]);  // Estado para las citas del paciente seleccionado

    const onSubmit = handleSubmit((data) => {
        console.log("Fecha UTC enviada:", data);
        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`La boleta ha sido ${type === "create" ? "creada" : "actualizada"}`);
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            toast("Error en la acción: " + state.error);
            console.error("Error en la acción: ", state.error);
        }
    }, [state]);

    const { pacientes = [] } = relatedData || {};

    // Maneja el cambio de paciente para cargar sus citas
    const handlePacienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pacienteId = parseInt(e.target.value);  // Convertimos el valor de string a número
        const selectedPaciente = pacientes.find((p: { id_paciente: number; citas: any[] }) => p.id_paciente === pacienteId);

        if (selectedPaciente) {
            setCitas(selectedPaciente.citas || []);
            setValue("id_cita", undefined); // Reseteamos el valor a null en vez de "" (string vacío)
        }
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nueva boleta" : "Actualizar boleta"}
            </h1>
            {data && (
                <InputField
                    label="Id"
                    name="id_ticket"
                    defaultValue={data?.id_ticket}
                    register={register}
                    error={errors?.id_ticket}
                    hidden
                />
            )}
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Paciente</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_paciente")}
                        defaultValue={type === "create" ? "" : data?.id_paciente}
                        onChange={handlePacienteChange}  // Manejar cambios en paciente
                    >
                        <option value="" disabled className="text-textdark">
                            Seleccione
                        </option>
                        {pacientes.map((paciente: { id_paciente: number; nombre: string; apellido: string }) => (
                            <option value={paciente.id_paciente} key={paciente.id_paciente}>
                                {paciente.nombre} {paciente.apellido}
                            </option>
                        ))}
                    </select>
                    {errors.id_paciente?.message && (
                        <p className="text-xs text-red-400">{errors.id_paciente.message.toString()}</p>
                    )}
                </div>

                {/* Select para citas del paciente */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Cita</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("id_cita")}
                        defaultValue={type === "create" ? "" : data?.id_cita}
                    >
                        <option value="" disabled className="text-textdark">
                            Seleccione una cita
                        </option>
                        {citas.map((cita: { id_cita: number; fecha_cita: string }) => (
                            <option key={cita.id_cita} value={cita.id_cita}>
                                {new Date(cita.fecha_cita).toLocaleString()}
                            </option>
                        ))}
                    </select>
                    {errors.id_cita?.message && (
                        <p className="text-xs text-red-400">{errors.id_cita.message.toString()}</p>
                    )}
                </div>

                {/* Campos restantes (tipo_comprobante, medio_pago, monto_total) */}
                {/* ... */}
            </div>

            {state.error && <span className="text-red-400"> Algo pasó mal </span>}
            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default TicketForm;
