import { PrismaClient, TipoRol, Sexo } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = Object.values(TipoRol);
  await prisma.rol.createMany({
    data: roles.map((nombre) => ({ nombre })),
    skipDuplicates: true,
  });
  console.log("Roles creados:", roles);

  for (const nombreRol of roles) {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: `${nombreRol} Nombre`,
        apellido: `${nombreRol} Apellido`,
        dni: `${Math.floor(10000000 + Math.random() * 90000000)}`,
        sexo: Sexo.MASCULINO,
        email: `${nombreRol.toLowerCase()}@example.com`,
        telefono: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        direccion: `${nombreRol} Street 123`,
        password: "12345",
        roles: {
          create: {
            rol: {
              connect: { nombre: nombreRol },
            },
          },
        },
      },
    });
    console.log(`Usuario con rol ${nombreRol} creado:`, usuario);

    if (nombreRol === TipoRol.VETERINARIO) {
      const empleado = await prisma.empleado.create({
        data: {
          idUsuario: usuario.idUsuario,
          especialidad: "Veterinaria",
        },
      });
      console.log(`Empleado creado para el usuario con rol ${nombreRol}:`, empleado);
    }
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
