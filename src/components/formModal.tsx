"use client";
import Image from "next/image"
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import AppointmentForm from "@/components/forms/appointmentForm";
import { deleteAppointment } from "@/actions/appointment.actions";
import { deletePatient } from "@/actions/patient.actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./formContainer";
import PatientForm from "./forms/patientForms";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteTicket } from "@/actions/ticket.actions";
import TicketForm from "./forms/ticketForm";


const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any
    ) => JSX.Element;
} = {
    cita: (setOpen, type, data, relatedData) => (
        <AppointmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />),
    paciente: (setOpen, type, data, relatedData) => (
        <PatientForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />),
    boleta: (setOpen, type, data, relatedData) => (
        <TicketForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />)
};

const deleteActions = {
    cita: deleteAppointment,
    paciente: deletePatient,
    boleta: deleteTicket,
    empleado: deleteTicket,
};

const IconComponent = ({ type }: { type: "create" | "view" | "update" | "delete" }) => {
    const icons = {
        create: <Plus size={20} color="white" />,
        view: <Eye size={18} />,
        update: <Pencil size={18} />,
        delete: <Trash2 size={18} />,
    };

    return icons[type] || null;
};

const FormModal = ({
    table, type, data, id, relatedData,
}: FormContainerProps & { relatedData?: any }) => {

    const size = type === "create" ? "w-auto px-4 py-2" : "w-7 h-7";
    const bgColor = type === "create" ? "bg-backbuttondefault" : type === "update" ? "bg-cyan-100" : type === "view" ? "bg-indigo-200" : "bg-red-100";

    const [open, setOpen] = useState(false);

    const Form = () => {

        const [state, formAction] = useActionState(deleteActions[table], { success: false, error: null });

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(`La ${table} a sido eliminada`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);


        return type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="text | number" name="id" defaultValue={id} hidden />
                <span className="text-center font-medium">
                    ¿Está seguro de eliminar esta {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Eliminar
                </button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](setOpen, type, data, relatedData)
        ) : (
            "Formulario no encontrado"
        );
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <IconComponent type={type} />
                {type === "create" && <span className="ml-2 text-sm font-medium text-textdefault">Agregar</span>}
            </button>

            {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md relative w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]">
                        <Form />
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image src="/close.png" alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormModal