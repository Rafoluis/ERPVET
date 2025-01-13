"use client";
import Image from "next/image"
import { useState } from "react";
import AppointmentForm from "@/app/components/forms/appointmentForm";

const FormModal = ({
    table, type, data, id,
}: {
    table:
    | "cita"
    | "paciente"
    | "empleado";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number | string;
}) => {

    const [open, setOpen] = useState(false);

    const Form = () => {
        return type === "delete" && id ? (
            <form action="" className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">
                    ¿Está seguro de eliminar esta {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Eliminar
                </button>
            </form>
        ) : (
            <AppointmentForm type="update" data={data} />
        );
    };

    return (
        <>
            <button
                className={type === "create" ? "px-4 py-2 flex items-center justify-center rounded-lg bg-sky-200" : "w-7 h-7 flex items-center justify-center rounded-full bg-blue-300"}
                onClick={() => setOpen(true)}
            >
                <Image src={type === "create" ? "/create.png" : `/${type}.png`} alt="" width={type === "create" ? 14 : 18} height={type === "create" ? 14 : 18} />
                {type === "create" && <span className="ml-2 text-sm font-medium">Nueva Cita</span>}
            </button>

            {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
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