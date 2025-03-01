"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InputField from "../inputField";
import { TicketSchema, ticketSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { unauthorized, useRouter } from "next/navigation";
import { createTicket, updateTicket } from "@/actions/ticket.actions";
import AutocompleteSelect, { OptionType } from "../autocompleteSelect";
import { SingleValue } from "react-select";
import { showToast } from "@/lib/toast";

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
        control,
        formState: { errors },
        watch,
    } = useForm<TicketSchema>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            monto_total: 0,
        },
    });

    const [state, formAction] = useActionState(
        type === "create" ? createTicket : updateTicket,
        { success: false, error: null }
    );

    const [citas, setCitas] = useState<any[]>([]);
    const router = useRouter();

    const isCitaFullyPaid = (cita: any) => {
        if (cita.deuda_restante !== undefined) {
            return Number(cita.deuda_restante) === 0;
        }

        const totalCost = cita.servicios.reduce(
            (acc: number, serv: any) => acc + serv.tarifa * serv.cantidad,
            0
        );
        let totalPaid = 0;
        if (cita.ticketCitas && Array.isArray(cita.ticketCitas)) {
            cita.ticketCitas.forEach((tc: any) => {
                if (tc.ticket && tc.ticket.pagos) {
                    totalPaid += tc.ticket.pagos.reduce(
                        (acc: number, pago: any) => acc + pago.monto,
                        0
                    );
                }
            });
        }
        return totalPaid >= totalCost;
    };

    // const handlePacienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const pacienteId = parseInt(e.target.value, 10);
    //     const { pacientes = [] } = relatedData || {};
    //     const selectedPaciente = pacientes.find(
    //         (p: { id_paciente: number; citas: any[] }) => p.id_paciente === pacienteId
    //     );
    //     if (selectedPaciente) {
    //         const filteredCitas = selectedPaciente.citas.filter((cita: any) => {
    //             return !isCitaFullyPaid(cita);
    //         });
    //         setCitas(filteredCitas);
    //         setValue("citas", []);
    //     }
    // };

    const onSubmit = handleSubmit(
        (data) => {
            console.log("Datos enviados:", data);
            startTransition(() => {
                formAction(data);
            });
        },
        (errors) => {
            console.error("Errores de validación:", errors);
        }
    );

    useEffect(() => {
        if (state.success) {
            showToast("success", `La boleta ha sido ${type === "create" ? "creada" : "actualizada"}`);
            // toast(
            //     `La boleta ha sido ${type === "create" ? "creada" : "actualizada"}`
            // );
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            showToast("error", `Error en la acción: ${state.error}`);
            // toast("Error en la acción: " + state.error);
            console.error("Error en la acción: ", state.error);
        }
    }, [state]);

    const { pacientes = [] } = relatedData || {};
    const [selectedCitas, setSelectedCitas] = useState<number[]>([]);
    const watchFraccionar = watch("fraccionar_pago");

    const handleToggleCita = (citaId: number) => {
        let newSelected: number[];
        if (selectedCitas.includes(citaId)) {
            newSelected = selectedCitas.filter((id) => id !== citaId);
        } else {
            newSelected = [...selectedCitas, citaId];
        }
        setSelectedCitas(newSelected);
        setValue("citas", newSelected);
    };

    const computedTotal = useMemo(() => {
        return selectedCitas.reduce((sum: number, citaId: number) => {
            const cita = citas.find((c: any) => c.id_cita === citaId);
            if (!cita) return sum;
            const totalFee = cita.servicios.reduce(
                (acc: number, s: any) => acc + s.tarifa * s.cantidad,
                0
            );
            const remaining =
                cita.deuda_restante !== undefined
                    ? Number(cita.deuda_restante)
                    : totalFee;
            return sum + remaining;
        }, 0);
    }, [selectedCitas, citas]);

    useEffect(() => {
        setValue("monto_total", computedTotal);
    }, [computedTotal, setValue]);

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

            {/* Selección de Paciente */}
            <div className="flex flex-col gap-2">
                <Controller
                    control={control}
                    name="id_paciente"
                    defaultValue={type === "create" ? null : data?.id_paciente}
                    render={({ field }) => {
                        const options: OptionType[] = pacientes.map(
                            (paciente: {
                                id_paciente: number;
                                nombre: string;
                                apellido: string;
                                citas?: any[];
                            }) => ({
                                value: paciente.id_paciente,
                                label: `${paciente.nombre} ${paciente.apellido}`,
                            })
                        );
                        return (
                            <AutocompleteSelect
                                label="Paciente"
                                options={options}
                                value={
                                    options.find((option) => option.value === field.value) || null
                                }
                                onChange={(selectedOption: SingleValue<OptionType>) => {
                                    const newValue = selectedOption ? selectedOption.value : null;
                                    field.onChange(newValue);
                                    if (newValue) {
                                        const selectedPaciente = pacientes.find(
                                            (p: { id_paciente: number; citas: any[] }) =>
                                                p.id_paciente === newValue
                                        );
                                        if (selectedPaciente && selectedPaciente.citas) {
                                            const filteredCitas = selectedPaciente.citas.filter(
                                                (cita: any) => !isCitaFullyPaid(cita)
                                            );
                                            setCitas(filteredCitas);
                                            setValue("citas", []);
                                            setSelectedCitas([]);
                                        }
                                    } else {
                                        setCitas([]);
                                        setValue("citas", []);
                                        setSelectedCitas([]);
                                    }
                                }}
                            />
                        );
                    }}
                />
                {errors.id_paciente?.message && (
                    <p className="text-xs text-red-400">
                        {errors.id_paciente.message.toString()}
                    </p>
                )}
            </div>

            {/* Selección múltiple de Citas (filtradas) */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500">
                    Citas disponibles (con deuda pendiente)
                </label>
                {citas.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No hay citas pendientes de pago
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {citas.map(
                            (cita: { id_cita: number; fecha_cita: string; servicios: any[]; deuda_restante?: number }) => {
                                const totalFee = cita.servicios.reduce(
                                    (acc: number, s: any) =>
                                        acc + s.tarifa * s.cantidad,
                                    0
                                );

                                const remaining =
                                    cita.deuda_restante !== undefined
                                        ? Number(cita.deuda_restante)
                                        : totalFee;
                                const isSelected = selectedCitas.includes(cita.id_cita);
                                return (
                                    <div
                                        key={cita.id_cita}
                                        className={`flex items-start border p-2 rounded-md bg-white ${isSelected
                                            ? "ring-2 ring-blue-500"
                                            : "hover:ring-1 hover:ring-gray-300"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-1 mr-2"
                                            checked={isSelected}
                                            onChange={() => handleToggleCita(cita.id_cita)}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {new Date(cita.fecha_cita).toLocaleString("es-PE", {
                                                    timeZone: "UTC",
                                                    hour12: false,
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            <div className="text-xs text-gray-600 mt-1">
                                                {cita.servicios.map((s: any) => (
                                                    <div key={s.id_servicio}>
                                                        • {s.nombre_servicio} (x{s.cantidad}) - S/
                                                        {s.tarifa.toFixed(2)}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold mt-1">
                                                Deuda: S/{remaining.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
                {errors.citas?.message && (
                    <p className="text-xs text-red-400">
                        {errors.citas.message.toString()}
                    </p>
                )}

                {/* Monto total acumulado */}
                {selectedCitas.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                        <label className="text-xs text-gray-500">
                            Monto total acumulado (deuda pendiente):
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                readOnly
                                className="p-2 border rounded-md w-full"
                                value={computedTotal.toFixed(2)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Fraccionar pago */}
            <div className="mt-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("fraccionar_pago")} />
                    <span className="text-sm">Fraccionar pago</span>
                </label>
                {watchFraccionar && (
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">
                            Ingrese monto parcial a pagar:
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("monto_parcial", { valueAsNumber: true })}
                            className="p-2 border rounded-md w-full"
                            placeholder="Ingrese monto parcial"
                        />
                        {errors.monto_parcial && (
                            <p className="text-xs text-red-400">
                                {errors.monto_parcial.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Fecha de emisión */}
            <div className="mt-2">
                <label className="text-sm font-medium">Fecha de emisión</label>
                <input
                    type="date"
                    {...register("fecha_emision")}
                    className="p-2 border rounded-md w-full"
                />
                {errors.fecha_emision && (
                    <p className="text-xs text-red-400">
                        {errors.fecha_emision.message}
                    </p>
                )}
            </div>

            {/* Tipo de comprobante */}
            <div className="mt-2">
                <label className="text-sm font-medium">Tipo de comprobante</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="BOLETA"
                            {...register("tipo_comprobante")}
                        />
                        Boleta
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="FACTURA"
                            {...register("tipo_comprobante")}
                        />
                        Factura
                    </label>
                </div>
                {errors.tipo_comprobante && (
                    <p className="text-xs text-red-400">
                        {errors.tipo_comprobante.message}
                    </p>
                )}
            </div>

            {/* Medio de pago */}
            <div className="mt-2">
                <label className="text-sm font-medium">Medio de pago</label>
                <select
                    {...register("medio_pago")}
                    className="p-2 border rounded-md w-full"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Selecciona el medio de pago
                    </option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA DEBITO">Tarjeta de Débito</option>
                    <option value="TARJETA CREDITO">Tarjeta de Crédito</option>
                    <option value="DEPOSITO BANCARIO">Depósito Bancario</option>
                    <option value="YAPE - PLIN">Yape / Plin</option>
                </select>
                {errors.medio_pago && (
                    <p className="text-xs text-red-400">
                        {errors.medio_pago.message}
                    </p>
                )}
            </div>

            {state.error && <span className="text-red-400"> Algo pasó mal </span>}
            <button
                type="submit"
                className="bg-blue-400 text-white p-2 rounded-md"
            >
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form >
    );
};

export default TicketForm;
