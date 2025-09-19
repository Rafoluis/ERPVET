"use client";
import Image from "next/image"
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormContainerProps } from "./formContainer";
import { Eye, Pencil, Plus, Trash2, UserRoundPlus } from "lucide-react";
import { showToast } from "@/lib/toast";
import MascotaForm from "./forms/mascotaForms";
import { deleteMascota } from "@/actions/mascota.actions";
import TableAction from "@/components/table/TableAction";
import ConfirmCloseModal from "./ConfirmCloseModal";
import TimeLineForm from "./forms/timeLineForm";
import RegistroVacunacionForm from "./forms/vacunaForm";
import { deleteRegistroVacunacion } from "@/actions/vaccination.actions";
import PropietarioForm from "./forms/propietarioForms";
import EmpleadoForm from "./forms/empleadoForm";
import { deleteEmpleado } from "@/actions/empleado.actions";

interface ExtendedFormModalProps extends FormContainerProps {
    relatedData?: any;
    onSuccess?: any;
    hideTrigger?: boolean;
    onClose?: any
}

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any,
        onSuccess?: any,
    ) => JSX.Element;
} = {
    mascota: (setOpen, type, data, relatedData) => (
    <MascotaForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>
    ),
    propietario: (setOpen, type, data, relatedData) => (
    <PropietarioForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>
    ),
    empleado: (setOpen, type, data, relatedData) => (
    <EmpleadoForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>
    ),
    timeline: (setOpen, type, data, relatedData, onSuccess) => (
    <TimeLineForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} onSuccess={onSuccess} />
    ),
    vacunacion: (setOpen, type,data,relatedData, onSuccess) =>(
    <RegistroVacunacionForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} onSuccess={onSuccess} />
    ),
};

const deleteActions: Record<string, any> = {
    mascota: deleteMascota,
    propietario: deleteMascota,
    vacunacion: deleteRegistroVacunacion,
    empleado: deleteEmpleado,
};

export default function FormModal({
    table,
    type,
    data,
    id,
    relatedData,
    onSuccess,
    onClose,
    hideTrigger = false,
    }: ExtendedFormModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleRequestClose = () => setShowConfirm(true);

    const handleConfirmClose = () => {
        setShowConfirm(false);
        setOpen(false);
        onClose?.();
    };
    const handleCancelClose = () => setShowConfirm(false);

    useEffect(() => {
    if (type === 'update' && hideTrigger) {
      setOpen(true);
    }
  }, [type, hideTrigger]);

    const widthClasses = "w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]";

    const isCreate = type === "create";
    const isUpdate = type === "update";
    const isDelete = type === "delete";

    const formRef = useRef(
        type === "delete" && id ? (
        <DeleteForm table={table} id={String(id)} setOpen={setOpen} />
        ) : (
        forms[table](setOpen, type as any, data, relatedData, onSuccess)
        )
    );

    return (
    <>
        {isCreate && (
        <button
            type="button"
            className="w-auto px-4 py-2 rounded-full bg-backbuttondefault hover:bg-backhoverbutton flex items-center justify-center"
            onClick={handleOpen}
        >
            <Plus size={20} color="white" />
            <span className="ml-2 text-sm font-medium text-textdefault">Agregar</span>
        </button>
        )}

        {!hideTrigger && !isCreate && isUpdate && (
        <TableAction
            icon={<Pencil />}
            onClick={handleOpen}
            className="shadow-sm hover:shadow-md bg-cyan-100 hover:bg-cyan-200"
            iconColor="text-black"
            hoverIconColor="text-black"
            iconSize="w-4 h-4"
        />
        )}

        {!isCreate && isDelete && (
        <TableAction
            icon={<Trash2 />}
            onClick={handleOpen}
            className="shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200"
            iconColor="text-black"
            hoverIconColor="text-black"
            iconSize="w-4 h-4"
        />
        )}

        {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center
        justify-center">
            <div
            className={`bg-white p-4 rounded-md relative w-[90&] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] ${widthClasses} z-50`}
            onClick={(e) => e.stopPropagation()}
            >
            {formRef.current}
            <div className="absolute top-4 right-4 cursor-pointer" onClick={handleRequestClose}>
                <Image src="/close.png" alt="Cerrar" width={14} height={14} />
            </div>
            </div>
        </div>
        )}

        {showConfirm && <ConfirmCloseModal onConfirm={handleConfirmClose} onCancel={handleCancelClose} />}
    </>
    );
    }

    function DeleteForm({ table, id, setOpen }: { table: string; id: string; setOpen: any }) {
    const [state, formAction] = useActionState(deleteActions[table], { success: false, error: null });
    const router = useRouter();

    useEffect(() => {
    if (state.success) {
        showToast("success", `La ${table} ha sido eliminada`);
        setOpen(false);
        router.refresh();
    }
    }, [state.success, router, setOpen, table]);

    return (
    <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <span className="text-center font-medium">¿Está seguro de eliminar esta {table}?</span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center">Eliminar</button>
    </form>
    );
}