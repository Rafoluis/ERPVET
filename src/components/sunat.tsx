"use client";
import { useState } from "react";
import PrintButton from "./printer/printerButton";


const SunatBoleta = ({ ticketId }: { ticketId: number | string }) => {
    const [ticket, setTicket] = useState("");
    const [loading, setLoading] = useState(false);

    const enviarBoleta = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/sunatBoleta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId }), // Se envía el ticketId
            });
            if (!response.ok) {
                console.error(`Error HTTP al enviar boleta: ${response.status}`);
                const errorText = await response.text();
                console.error("Detalles:", errorText);
                return;
            }
            const data = await response.json();
            setTicket(data.numTicket || "No se recibió número de ticket");
            console.log("Boleta enviada, Ticket:", data.numTicket);
        } catch (error) {
            console.error("Error enviando boleta:", error);
        } finally {
            setLoading(false);
        }
    };

    const consultarEstado = async () => {
        if (!ticket) return;
        try {
            const response = await fetch(`/api/sunatEstado?ticket=${ticket}`);
            if (!response.ok) {
                console.error(`Error HTTP al consultar estado: ${response.status}`);
                return;
            }
            const data = await response.json();
            console.log("Estado del ticket:", data);
        } catch (error) {
            console.error("Error consultando estado:", error);
        }
    };

    return (
        <div>
            <button onClick={enviarBoleta} disabled={loading} style={{ marginRight: "10px" }}>
                {loading ? "Enviando..." : "Enviar Boleta"}
            </button>
            <button onClick={consultarEstado} disabled={!ticket}>
                Consultar Estado
            </button>
            <PrintButton ticketId={ticket} />
        </div>
    );
};

export default SunatBoleta;
