"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InputField from "../inputField";
import { createAppointment, updateAppointment } from "@/actions/appointment.actions";
import { appointmentSchema, AppointmentSchema } from "@/lib/formSchema";
import { startTransition, useActionState, useState } from "react";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Servicio } from "@prisma/client";
import Table from "../table";
import { Plus, Trash2 } from "lucide-react";
import { SingleValue } from "react-select";
import AutocompleteSelect, { OptionType } from "../autocompleteSelect";
import FormModal from "../formModal";
import { showToast } from "@/lib/toast";

type SelectedService = { service: Servicio; quantity: number };

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
        defaultValues: { servicios: [] },
    });

    const [state, formAction] = useActionState(
        type === "create" ? createAppointment : updateAppointment,
        { success: false, error: null }
    );
    const router = useRouter();

    const formatHoraCitaFinal = (
        fecha: string | Date | undefined,
        hora: string | undefined
    ) => {
        if (!hora) return undefined;
        const baseDate = fecha
            ? fecha instanceof Date
                ? new Date(fecha)
                : new Date(fecha)
            : new Date();
        const [hours, minutes] = hora.split(":").map(Number);
        baseDate.setHours(hours, minutes, 0, 0);
        const dateWithTimezone = new Date(baseDate.getTime() - 5 * 60 * 60 * 1000);
        return dateWithTimezone.toISOString();
    };

    const onSubmit = handleSubmit((formData) => {
        formData.hora_cita_final = formatHoraCitaFinal(
            formData.fecha_cita,
            formData.hora_cita_final
        );
        console.log("Form submitted with modified data", formData);
        startTransition(() => formAction(formData));
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

    const mapOptions = <T,>(
        items: T[],
        idKey: keyof T,
        labelFn: (item: T) => string
    ): OptionType[] =>
        items.map((item) => ({
            value: String(item[idKey]),
            label: labelFn(item),
        }));

    const { empleados, servicios } = relatedData;
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [selectedQuantity, setSelectedQuantity] = useState<string>("1");

    const serviceOptions: OptionType[] = mapOptions(
        servicios,
        "id_servicio",
        (s: Servicio) => s.nombre_servicio
    );

    useEffect(() => {
        if (type === "update" && relatedData?.selectedServices) {
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
        const selectedService = servicios.find(
            (s: Servicio) => s.id_servicio === selectedServiceIdNumber
        );
        if (!selectedService) return;

        setSelectedServices((prevServices) => {
            const alreadyExists = prevServices.some(
                (s) => s.service.id_servicio === selectedServiceIdNumber
            );
            return alreadyExists
                ? prevServices
                : [...prevServices, { service: selectedService, quantity: parseInt(selectedQuantity, 10) }];
        });

        setSelectedServiceId("");
        setSelectedQuantity("1");
    };

    const [patients, setPatients] = useState(relatedData?.pacientes || []);
    useEffect(() => {
        setPatients(relatedData?.pacientes || []);
    }, [relatedData?.pacientes]);

    const handlePatientSuccess = (newPatient: { id_paciente: number; nombre: string; apellido: string }) => {
        setPatients((prev: any) => [...prev, newPatient]);
        setValue("id_paciente", newPatient.id_paciente);
    };

    const selectedPatientId = watch("id_paciente");

    const patientHasDebt = useMemo(() => {
        if (!selectedPatientId || !relatedData?.pacientes) return false;
        const selectedPatient = relatedData.pacientes.find(
            (p: { id_paciente: number; citas?: any[] }) => p.id_paciente === Number(selectedPatientId)
        );
        if (!selectedPatient || !selectedPatient.citas) return false;
        return selectedPatient.citas.some((cita: any) => Number(cita.deuda_restante) > 0);
    }, [selectedPatientId, relatedData]);

    const handleRemoveService = (index: number) => {
        setSelectedServices((prev) => prev.filter((_, i) => i !== index));
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setSelectedServices((prevServices) =>
            prevServices.map((service, i) =>
                i === index ? { ...service, quantity: newQuantity } : service
            )
        );
    };

    const serviceColumns = [
        { header: "Servicio", accessor: "nombre", className: "text-sm font-bold p-1" },
        { header: "Cantidad", accessor: "cantidad", className: "text-sm font-bold p-1" },
        { header: "Tarifa", accessor: "tarifa", className: "text-sm font-bold p-1" },
        { header: "Tarifa Total", accessor: "total", className: "text-sm font-bold p-1" },
        { header: "Acción", accessor: "accion", className: "text-sm font-bold p-1" },
    ];

    const servicesDataForTable = selectedServices.map((item, index) => ({
        ...item,
        __index: index,
    }));

    const renderServiceRow = (item: SelectedService & { __index: number }) => (
        <tr key={item.__index}>
            <td className="text-xs p-1">{item.service.nombre_servicio}</td>
            <td className="text-xs p-1">
                <input
                    type="number"
                    className="w-16 p-1 border rounded border-gray-300 text-center text-xs"
                    value={item.quantity}
                    onChange={(e) =>
                        handleQuantityChange(item.__index, parseInt(e.target.value, 10))
                    }
                />
            </td>
            <td className="text-xs p-1">S/ {item.service.tarifa.toFixed(2)}</td>
            <td className="text-xs p-1">
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

    const renderAutocompleteField = <T extends keyof AppointmentSchema>(
        name: T,
        label: string,
        options: OptionType[],
        defaultValue: AppointmentSchema[T] | undefined,
        extra?: React.ReactNode,
        error?: any
    ) => (
        <div className="flex flex-col gap-2">
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue as any}
                render={({ field }) => (
                    <div className="flex items-center gap-2">
                        <AutocompleteSelect
                            name={field.name}
                            label={label}
                            options={options}
                            value={options.find((option) => option.value === String(field.value)) || null}
                            onChange={(selectedOption: SingleValue<OptionType>) =>
                                field.onChange(selectedOption ? selectedOption.value : null)
                            }
                        />
                        {extra}
                    </div>
                )}
            />
            {error && <p className="text-xs text-red-400">{error.message.toString()}</p>}
        </div>
    );

    const patientOptions = mapOptions(
        patients,
        "id_paciente",
        (p: any) => `${p.nombre} ${p.apellido}`
    );
    const employeeOptions = mapOptions(
        empleados,
        "id_empleado",
        (e: any) => `${e.nombre} ${e.apellido}`
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
                {renderAutocompleteField(
                    "id_paciente",
                    "Paciente",
                    patientOptions,
                    type === "create" ? undefined : data?.id_paciente,
                    <div className="w-auto">
                        <label className="text-xs text-transparent mb-1 block">Acción</label>
                        <FormModal table="paciente" type="create" onSuccess={handlePatientSuccess} variant="appointment" />
                    </div>,
                    errors.id_paciente
                )}
                {renderAutocompleteField(
                    "id_empleado",
                    "Odontólogo",
                    employeeOptions,
                    type === "create" ? undefined : data?.id_empleado,
                    undefined,
                    errors.id_empleado
                )}
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                    <InputField
                        label="Fecha y hora de cita"
                        name="fecha_cita"
                        defaultValue={
                            data?.fecha_cita
                                ? new Date(data.fecha_cita).toISOString().slice(0, 16)
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
                        name="servicioSelect"
                        label="Servicio"
                        options={serviceOptions}
                        value={serviceOptions.find((option) => option.value === selectedServiceId) || null}
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

            {servicesDataForTable.length > 0 && (
                <div>
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
                    <p className="text-green-600 font-bold text-sm mt-1">
                        La cita ha sido paga
                    </p>
                )}
            </div>

            {state.error && <span className="text-red-400">Algo pasó mal</span>}
            <button type="submit" className="bg-backbuttondefault text-white p-2 rounded-md">
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form>
    );
};

export default AppointmentForm;
