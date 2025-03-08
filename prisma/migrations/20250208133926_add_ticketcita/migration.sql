-- CreateTable
CREATE TABLE "TicketCita" (
    "id_ticket" INTEGER NOT NULL,
    "id_cita" INTEGER NOT NULL,

    CONSTRAINT "TicketCita_pkey" PRIMARY KEY ("id_ticket","id_cita")
);

-- AddForeignKey
ALTER TABLE "TicketCita" ADD CONSTRAINT "TicketCita_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket"("id_ticket") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCita" ADD CONSTRAINT "TicketCita_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "Cita"("id_cita") ON DELETE RESTRICT ON UPDATE CASCADE;
