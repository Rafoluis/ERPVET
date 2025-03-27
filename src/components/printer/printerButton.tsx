"use client";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultTableStyles } from "./pdfStyles";

type PrintButtonProps = {
  ticketId: number | string;
};

const PrintButton = ({ ticketId }: PrintButtonProps) => {
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/ticket?id=${ticketId}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Error al obtener los datos del ticket");
        setTicket(data);
      } catch (error) {
        console.error("Error al obtener los datos del ticket:", error);
      }
    };

    if (ticketId) fetchTicket();
  }, [ticketId]);

  const generatePDF = async () => {
    try {
      // Volver a obtener el ticket actualizado en el momento de generar el PDF
      const res = await fetch(`/api/ticket?id=${ticketId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al obtener los datos del ticket");
      }
      const ticketToPrint = data;

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

      const defaultMargin = { left: 14, right: 14 };

      const logoData = "/logodental.png";
      // (x=10, y=15) ancho=35 alto=25
      doc.addImage(logoData, "PNG", 10, 15, 35, 25);

      const companyX = 50;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Nombre de la empresa", companyX, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("RUC: 123456789", companyX, 26);
      doc.text("Dirección", companyX, 32);
      doc.text("Teléfono", companyX, 38);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("COMPROBANTE DE PAGO", pageWidth / 2, 50, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        `CÓDIGO DE COMPROBANTE: ${ticket.id_ticket}`,
        pageWidth / 2,
        56,
        { align: "center" }
      );

      const paciente = ticket?.paciente
        ? {
          nombreCompleto: `${ticket.paciente.usuario.nombre} ${ticket.paciente.usuario.apellido}`,
          direccion: ticket.paciente.usuario.direccion || "No registrada",
          dni: ticket.paciente.usuario.dni,
        }
        : { nombreCompleto: "No encontrado", direccion: "", dni: "" };

      doc.autoTable({
        ...defaultTableStyles,
        startY: 65,
        margin: defaultMargin,
        head: [["Nombres y Apellidos:", paciente.nombreCompleto]],
        body: [
          ["Dirección", paciente.direccion],
          ["DNI", paciente.dni],
        ],
      });

      const fechaEmision = ticket.fecha_emision
        ? new Date(ticket.fecha_emision).toLocaleDateString("es-PE", {
          timeZone: "UTC",
        })
        : "";
      const estadoPago = ticket.deuda_restante > 0 ? "PAGO PARCIAL" : "PAGO TOTAL";
      const medioPago = ticket.medio_pago || "EFECTIVO";
      const moneda = "SOLES";

      doc.autoTable({
        ...defaultTableStyles,
        startY: doc.lastAutoTable.finalY + 5,
        margin: defaultMargin,
        head: [
          [
            "FECHA DE EMISIÓN",
            "ESTADO DE PAGO",
            "MÉTODO DE PAGO",
            "MONEDA",
          ],
        ],
        body: [[fechaEmision, estadoPago, medioPago, moneda]],
      });

      // TABLA
      let itemsWithDate: Array<{
        fechaCita: Date;
        serviceName: string;
        description: string;
        cantidad: number;
        tarifa: number;
      }> = [];

      if (ticket?.ticketCitas?.length > 0) {
        ticket.ticketCitas.forEach((ticketCita: any) => {
          if (ticketCita.cita && ticketCita.cita.servicios?.length > 0) {
            const fechaCita = new Date(ticketCita.cita.fecha_cita);
            const fechaFormatted = fechaCita.toLocaleDateString("es-PE", {
              timeZone: "UTC",
            });

            ticketCita.cita.servicios.forEach((servicioCita: any) => {
              const descripcionBase = servicioCita.servicio.descripcion
                ? servicioCita.servicio.descripcion + " - "
                : "";
              const description = `${descripcionBase}De la cita - ${fechaFormatted}`;

              itemsWithDate.push({
                fechaCita,
                serviceName: servicioCita.servicio.nombre_servicio,
                description,
                cantidad: servicioCita.cantidad,
                tarifa: servicioCita.servicio.tarifa,
              });
            });
          } else {
            const fechaFallback = new Date(ticket.fecha_emision);
            const fechaFormatted = fechaFallback.toLocaleDateString("es-PE", {
              timeZone: "UTC",
            });
            itemsWithDate.push({
              fechaCita: fechaFallback,
              serviceName: "CONSULTA",
              description: `De la cita - ${fechaFormatted}`,
              cantidad: 1,
              tarifa: ticket.monto_total || 0,
            });
          }
        });
      } else {
        const fechaFallback = new Date(ticket.fecha_emision);
        const fechaFormatted = fechaFallback.toLocaleDateString("es-PE", {
          timeZone: "UTC",
        });
        itemsWithDate.push({
          fechaCita: fechaFallback,
          serviceName: "CONSULTA",
          description: `De la cita - ${fechaFormatted}`,
          cantidad: 1,
          tarifa: ticket.monto_total || 0,
        });
      }

      itemsWithDate.sort((a, b) => a.fechaCita.getTime() - b.fechaCita.getTime());

      const items = itemsWithDate.map((item, index) => [
        index + 1,
        item.serviceName,
        item.description,
        item.cantidad,
        item.tarifa,
      ]);

      doc.autoTable({
        ...defaultTableStyles,
        startY: doc.lastAutoTable.finalY + 5,
        margin: defaultMargin,
        head: [["ITEM", "SERVICIO", "DESCRIPCIÓN", "CANT.", "P. UNID."]],
        body: items,
      });

      // ALTO FIJO
      const bottomSectionHeight = 100;
      const bottomSectionStart = pageHeight - bottomSectionHeight;

      const rectX = defaultMargin.left;
      const rectWidth = pageWidth - (defaultMargin.left + defaultMargin.right);
      const rectHeight = 8;
      const rectY = bottomSectionStart;

      doc.setLineWidth(0.1);
      doc.setDrawColor(0, 0, 0);
      doc.rect(rectX, rectY, rectWidth, rectHeight);

      doc.setFontSize(10);
      doc.text(
        `SON: ${ticket.monto_total} SOLES CON CERO CÉNTIMOS`,
        rectX + 2,
        rectY + 5,
        { align: "left" }
      );

      const bottomY = rectY + rectHeight + 5;

      doc.autoTable({
        ...defaultTableStyles,
        startY: bottomY,
        margin: { left: defaultMargin.left },
        tableWidth: 80,
        head: [["OBSERVACIONES"]],
        body: [["Observación de ejemplo"]],
      });

      const total = ticket.monto_total || 0;
      const pagado = ticket.monto_pagado || 0;
      const deuda = ticket.deuda_restante || 0;

      const summaryData = [
        ["OP. GRAVADAS", `S/ ${total}`],
        ["OP. INAFECTAS", "S/ 0"],
        ["OP. EXONERADAS", "S/ 0"],
        ["OP. GRATUITAS", "S/ 0"],
        ["DESCUENTOS", "S/ 0"],
        ["IGV 18%", `S/ ${(total * 0.18).toFixed(2)}`],
        ["IMPORTE TOTAL", `S/ ${total}`],
      ];

      if (deuda > 0) {
        summaryData.push(["MONTO PAGADO", `S/ ${pagado}`]);
        summaryData.push(["DEUDA RESTANTE", `S/ ${deuda}`]);
      }

      doc.autoTable({
        ...defaultTableStyles,
        startY: bottomY,
        margin: { left: 110 },
        head: [["", ""]],
        body: summaryData,
      });

      // PIE DE PAGINA
      doc.setFontSize(8);
      doc.text(
        "Esta es una representación impresa de la Boleta electrónica, puede verificarlo utilizando ...",
        defaultMargin.left,
        doc.internal.pageSize.getHeight() - 5
      );

      doc.save(`Boleta_${ticketId}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
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
