"use client";

import { useState } from "react";

const estadosDisponibles = [
    "AGENDADO",
    "COMPLETADO",
    "EN_PROCESO",
    "FINALIZADO",
    "CANCELADO",
];

interface EstadoDropdownProps {
    initialEstado: string;
    onChange?: (nuevoEstado: string) => void;
}

export default function EstadoDropdown({ initialEstado, onChange }: EstadoDropdownProps) {
    const [estado, setEstado] = useState(initialEstado);
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        setEstado(value);
        setOpen(false);
        if (onChange) onChange(value);
    };

    // Función para determinar la clase de fondo según el estado
    const getBgColor = (est: string) => {
        switch (est) {
            case "AGENDADO":
                return "bg-backbuttonsecondary";
            case "COMPLETADO":
                return "bg-backbuttongreen";
            case "EN_PROCESO":
                return "bg-backbuttonyellow";
            default:
                return "bg-backbuttonred";
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`py-1 px-3 rounded-lg text-textdark ${getBgColor(estado)}`}
            >
                {estado === "EN_PROCESO" ? "EN PROCESO" : estado}
            </button>
            {open && (
                <select
                    className="absolute top-full left-0 mt-1 p-2 border border-gray-300 rounded-md bg-white z-10"
                    value={estado}
                    onChange={(e) => handleSelect(e.target.value)}
                    onBlur={() => setOpen(false)}
                    autoFocus
                >
                    {estadosDisponibles.map((est) => (
                        <option key={est} value={est}>
                            {est === "EN_PROCESO" ? "EN PROCESO" : est}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
