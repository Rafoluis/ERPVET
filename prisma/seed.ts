import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      apellido: 'User',
      dni: '12345678',
      sexo: 'MASCULINO',
      email: 'admin@example.com',
      telefono: '123456789',
      direccion: 'Admin Street 123',
      tipo_usuario: 'ADMIN',
      password: 'securepassword',
    },
  });

  console.log('Administrador creado:', admin);

  const empleadoUsuario = await prisma.usuario.create({
    data: {
      nombre: 'Empleado',
      apellido: 'User',
      dni: '87654321',
      sexo: 'FEMENINO',
      email: 'empleado@example.com',
      telefono: '987654321',
      direccion: 'Empleado Avenue 456',
      tipo_usuario: 'EMPLEADO',
      password: 'securepassword',
      empleado: {
        create: {
          especialidad: 'Odontología',
          tipo_empleado: 'ODONTOLOGO',
        },
      },
    },
  });

  console.log('Empleado creado:', empleadoUsuario);

  const pacienteUsuario = await prisma.usuario.create({
    data: {
      nombre: 'Paciente',
      apellido: 'User',
      dni: '11223344',
      sexo: 'MASCULINO',
      email: 'paciente@example.com',
      telefono: '1122334455',
      direccion: 'Paciente Boulevard 789',
      tipo_usuario: 'PACIENTE',
      password: 'securepassword',
      paciente: {
        create: {
          fecha_nacimiento: new Date('1990-01-01'),
        },
      },
    },
  });

  console.log('Paciente creado:', pacienteUsuario);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
