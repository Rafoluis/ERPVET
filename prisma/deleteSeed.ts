import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando limpieza de la base de datos...");
  await prisma.empleado.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Limpieza completada: Todos los datos han sido eliminados.");
}

main()
  .catch((e) => {
    console.error("Error durante la limpieza de la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
