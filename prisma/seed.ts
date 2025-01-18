import { PrismaClient, TipoRol } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = Object.values(TipoRol);
  await prisma.rol.createMany({
    data: roles.map((rol) => ({ nombre: rol })),
    skipDuplicates: true,
  });
  console.log("Roles creados:", roles);

  for (const rol of roles) {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: `${rol} Nombre`,
        apellido: `${rol} Apellido`,
        dni: `${Math.floor(10000000 + Math.random() * 90000000)}`, 
        sexo: "MASCULINO",
        email: `${rol.toLowerCase()}@example.com`,
        telefono: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        direccion: `${rol} Street 123`,
        password: "12345",
        roles: {
          create: {
            rol: {
              connect: { nombre: rol },
            },
          },
        },
      },
    });
    console.log(`Usuario con rol ${rol} creado:`, usuario);
  }
}

main()
  .catch((e) => {
    console.error("Error al crear datos iniciales:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
