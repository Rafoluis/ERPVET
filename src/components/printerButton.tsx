"use client";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";

const PrintButton = ({ ticketId }: { ticketId: number }) => {
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/ticket?id=${ticketId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al obtener los datos del ticket");
        setTicket(data);
      } catch (error) {
        console.error("Error al obtener los datos del ticket:", error);
      }
    };

    if (ticketId) fetchTicket();
  }, [ticketId]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Nombre de la empresa", 20, 20);
    doc.setFontSize(10);
    doc.text("RUC", 20, 26);
    doc.text("Dirección", 20, 32);
    doc.text("Teléfono", 20, 38);
    doc.setFontSize(14);
    doc.text("COMPROBANTE DE PAGO", 70, 50);
    doc.setFontSize(10);
    doc.text("CÓDIGO DE COMPROBANTE", 85, 56);

    const paciente = ticket?.paciente || {
      nombre: "Maria Perez",
      direccion: "Arequipa",
      dni: "12345678"
    };

    doc.autoTable({
      startY: 65,
      head: [["Nombres y Apellidos:", paciente.nombre, "", ""]],
      body: [
        ["Dirección", paciente.direccion, "", ""],
        ["DNI", paciente.dni, "", ""]
      ],
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [["FECHA DE EMISIÓN", "ESTADO DE PAGO", "MÉTODO DE PAGO", "MONEDA"]],
      body: [[
        ticket?.fecha_emision || "01-12-2025",
        "PAGO TOTAL",
        ticket?.medio_pago || "EFECTIVO",
        "SOLES"
      ]],
      styles: { fontSize: 10, cellPadding: 2 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [["ITEM", "SERVICIO", "DESCRIPCIÓN", "CANT.", "P. UNID."]],
      body: ticket?.ticketCitas?.map((item: any, index: number) => ([
        index + 1,
        "CONSULTA",
        "",
        1,
        ticket?.monto_total || 20
      ])) || [["01", "CONSULTA", "", "1", "20"]],
      styles: { fontSize: 10, cellPadding: 2 }
    });

    doc.text("SON: VEINTE SOLES CON CERO CÉNTIMOS", 14, doc.lastAutoTable.finalY + 10);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["OBSERVACIONES", "", "", ""]],
      body: [
        ["OP. GRAVADAS", "", "", "S/"],
        ["OP. INAFECTAS", "", "", "S/"],
        ["OP. EXONERADAS", "", "", "S/"],
        ["OP. GRATUITAS", "", "", "S/"],
        ["DESCUENTOS", "", "", "S/"],
        ["IGV 18%", "", "", "S/"],
        ["IMPORTE TOTAL", "", "", ticket?.monto_total || "20"]
      ],
      styles: { fontSize: 10, cellPadding: 2 }
    });

    doc.setFontSize(8);
    doc.text(
      "Esta es una representación impresa de la Boleta electrónica, puede verificarlo utilizando ...",
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`Boleta_${ticketId}.pdf`);
  };

  return (
    <button
      className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-200 hover:bg-indigo-300"
      onClick={generatePDF}
      disabled={!ticket}
    >
      <Printer size={18} />
    </button>
  );
};

export default PrintButton;
