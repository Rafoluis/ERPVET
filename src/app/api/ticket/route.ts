import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return Response.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id_ticket: parseInt(id, 10) },
            include: { pagos: true },
        });

        if (!ticket) {
            return Response.json({ error: "Ticket no encontrado" }, { status: 404 });
        }

        return Response.json(ticket, { status: 200 });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
