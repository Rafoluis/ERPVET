"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InputField from "../inputField";
import { createAppointment, updateAppointment } from "@/actions/appointment.actions";
import { appointmentSchema, AppointmentSchema } from "@/lib/formSchema";
import { startTransition, useActionState, useState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Servicio } from "@prisma/client";
import Table from "../table";
import { Plus, Trash2 } from "lucide-react";
import { SingleValue } from "react-select";
import AutocompleteSelect, { OptionType } from "../autocompleteSelect";
import { useMemo } from "react";
import { showToast } from "@/lib/toast";

type SelectedService = { service: Servicio; quantity: number; };

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
        setValue,
        control,
        watch,
    } = useForm<AppointmentSchema>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            servicios: [],
        },
    });

    const [state, formAction] = useActionState(
        type === "create" ? createAppointment : updateAppointment,
        { success: false, error: null }
    );

    const router = useRouter();

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

        startTransition(() => {
            formAction(data);
        });
    });

    useEffect(() => {
        if (state.success) {
            const message = `La cita ha sido ${type === "create" ? "creada" : "actualizada"}`;
            // toast(`La cita ha sido ${type === "create" ? "creada" : "actualizada"}`);
            showToast("success", message);
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            // toast("Error en la acción: " + state.error);
            showToast("error", "Error en la acción: ");
            console.error("Error en la acción:", state.error);
        }
    }, [state, router, setOpen, type]);

    const { pacientes, empleados, servicios } = relatedData;
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [selectedQuantity, setSelectedQuantity] = useState<string>("1");

    const serviceOptions: OptionType[] = servicios.map((service: Servicio) => ({
        value: service.id_servicio.toString(),
        label: service.nombre_servicio,
    }));

    useEffect(() => {
        if (type === "update" && relatedData?.selectedServices) {
            console.log("Cargando servicios en update:", relatedData.selectedServices);
            const initialServices: SelectedService[] = relatedData.selectedServices.map((s: any) => ({
                service: {
                    id_servicio: s.id_servicio,
                    nombre_servicio: s.nombre_servicio,
                    tarifa: s.tarifa,
                },
                quantity: s.cantidad,
            }));
            setSelectedServices(initialServices);
        }
    }, [type, relatedData]);

    useEffect(() => {
        const serviciosValue = selectedServices.map((item) => ({
            id_servicio: item.service.id_servicio,
            cantidad: item.quantity,
        }));
        setValue("servicios", serviciosValue);
    }, [selectedServices, setValue]);

    const handleAddService = () => {
        if (!selectedServiceId) return;
        const selectedServiceIdNumber = parseInt(selectedServiceId, 10);
        const selectedService = servicios.find((s: Servicio) => s.id_servicio === selectedServiceIdNumber);
        if (!selectedService) return;

        setSelectedServices((prevServices) => {
            const alreadyExists = prevServices.some((s) => s.service.id_servicio === selectedServiceIdNumber);
            if (alreadyExists) {
                return prevServices;
            } else {
                return [...prevServices, { service: selectedService, quantity: parseInt(selectedQuantity, 10) }];
            }
        });

        setSelectedServiceId("");
        setSelectedQuantity("1");
    };

    const selectedPatientId = watch("id_paciente");

    const patientHasDebt = useMemo(() => {
        if (!selectedPatientId || !relatedData?.pacientes) return false;
        const selectedPatient = relatedData.pacientes.find(
            (p: { id_paciente: number; citas?: any[] }) =>
                p.id_paciente === Number(selectedPatientId)
        );
        if (!selectedPatient || !selectedPatient.citas) return false;
        return selectedPatient.citas.some(
            (cita: any) => Number(cita.deuda_restante) > 0
        );
    }, [selectedPatientId, relatedData]);
    const handleRemoveService = (index: number) => {
        setSelectedServices((prev) => prev.filter((_, i) => i !== index));
    };

    const serviceColumns = [
        { header: "Servicio", accessor: "nombre", className: "text-sm font-bold  p-1" },
        { header: "Cantidad", accessor: "cantidad", className: "text-sm  font-bold p-1" },
        { header: "Tarifa", accessor: "tarifa", className: "text-sm  font-bold  p-1" },
        { header: "Tarifa Total", accessor: "total", className: "text-sm  font-bold  p-1" },
        { header: "Acción", accessor: "accion", className: "text-sm  font-bold  p-1" },
    ];

    const servicesDataForTable = selectedServices.map((item, index) => ({
        ...item,
        __index: index,
    }));

    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setSelectedServices((prevServices) => {
            const updatedServices = prevServices.map((service, i) =>
                i === index ? { ...service, quantity: newQuantity } : service
            );
            return updatedServices;
        });
    };

    const renderServiceRow = (item: SelectedService & { __index: number }) => (
        <tr key={item.__index} className="">
            <td className="text-xs  p-1">{item.service.nombre_servicio}</td>
            <td className="text-xs p-1">
                <input
                    type="number"
                    className="w-16 p-1 border rounded border-gray-300 text-center text-xs"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.__index, parseInt(e.target.value, 10))}
                />
            </td>
            <td className="text-xs p-1">S/ {item.service.tarifa.toFixed(2)}</td>
            <td className="text-xs  p-1">
                S/ {(item.service.tarifa * item.quantity).toFixed(2)}
            </td>
            <td className="text-xs p-1">
                <button
                    type="button"
                    onClick={() => handleRemoveService(item.__index)}
                    className="bg-red-500 px-2 py-1 rounded"
                >
                    <Trash2 size={17} color="white" />
                </button>
            </td>
        </tr>
    );


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nueva cita" : "Actualizar cita"}
            </h1>

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
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                    <Controller
                        control={control}
                        name="id_paciente"
                        defaultValue={type === "create" ? null : data?.id_paciente}
                        render={({ field }) => {
                            const options: OptionType[] = pacientes.map(
                                (paciente: { id_paciente: number; nombre: string; apellido: string }) => ({
                                    value: paciente.id_paciente,
                                    label: `${paciente.nombre} ${paciente.apellido}`,
                                })
                            );
                            return (
                                <AutocompleteSelect
                                    label="Paciente"
                                    options={options}
                                    value={options.find((option) => option.value === field.value) || null}
                                    onChange={(selectedOption: SingleValue<OptionType>) =>
                                        field.onChange(selectedOption ? selectedOption.value : null)
                                    }
                                />
                            );
                        }}
                    />
                    {errors.id_paciente?.message && (
                        <p className="text-xs text-red-400">{errors.id_paciente.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Controller
                        control={control}
                        name="id_empleado"
                        defaultValue={type === "create" ? null : data?.id_empleado}
                        render={({ field }) => {
                            const options = empleados.map(
                                (empleado: { id_empleado: number; nombre: string; apellido: string }) => ({
                                    value: empleado.id_empleado,
                                    label: `${empleado.nombre} ${empleado.apellido}`,
                                })
                            );
                            return (
                                <AutocompleteSelect
                                    label="Odontólogo"
                                    options={options}
                                    value={options.find((o: { value: number; }) => o.value === field.value) || null}
                                    onChange={(selectedOption: SingleValue<OptionType>) =>
                                        field.onChange(selectedOption ? selectedOption.value : null)
                                    }
                                />
                            );
                        }}
                    />
                    {errors.id_empleado?.message && (
                        <p className="text-xs text-red-400">{errors.id_empleado.message.toString()}</p>
                    )}
                </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

            {patientHasDebt && (
                <p className="text-red-500 text-sm mt-1">
                    El paciente tiene deudas pendientes de pago
                </p>
            )}

            {/* Servicio, Cantidad y Tarifa */}

            <div className="flex items-center gap-2 md:gap-4">
                <div className="w-64">
                    <AutocompleteSelect
                        label="Servicio"
                        options={serviceOptions}
                        value={
                            serviceOptions.find((option) => option.value === selectedServiceId) ||
                            null
                        }
                        onChange={(selectedOption: SingleValue<OptionType>) =>
                            setSelectedServiceId(selectedOption ? String(selectedOption.value) : "")
                        }
                    />
                </div>

                <div className="w-24">
                    <InputField
                        label="Cantidad"
                        name="cantidadServicio"
                        min={1}
                        type="number"
                        defaultValue="1"
                        value={selectedQuantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSelectedQuantity(e.target.value)
                        }
                        register={() => { }}
                    />
                </div>

                <div className="w-auto">
                    <label className="text-xs text-transparent mb-1 block">Acción</label>
                    <button
                        type="button"
                        onClick={handleAddService}
                        disabled={!selectedServiceId}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${selectedServiceId ? "bg-backbuttondefault" : "bg-gray-400"
                            }`}
                    >
                        <Plus size={17} color="white" /> Agregar servicio
                    </button>
                </div>
            </div>

            {/* Título y tabla de servicios seleccionados */}
            {servicesDataForTable.length > 0 && (
                <div className="">
                    <h3 className="text-xs text-gray-500 mt-1">Servicios seleccionados:</h3>
                    <div className="border border-gray-300 rounded-md p-2 mt-1">
                        <Table
                            columns={serviceColumns}
                            data={servicesDataForTable}
                            renderRow={renderServiceRow}
                        />
                    </div>
                </div>
            )}

            {errors.servicios?.message && (
                <p className="text-xs text-red-400">{errors.servicios.message.toString()}</p>
            )}

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
                {type === "update" && data?.deuda_restante === 0 && (
                    <p className="text-green-600 font-bold text-sm mt-1">La cita a sido paga</p>
                )}

            </div>

            {state.error && <span className="text-red-400">Algo pasó mal</span>}
            <button type="submit" className="bg-backbuttondefault text-white p-2 rounded-md">
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form >
    );
};

export default AppointmentForm;
