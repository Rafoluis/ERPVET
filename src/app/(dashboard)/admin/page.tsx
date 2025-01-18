import FormContainer from '@/components/formContainer';
import Table from '@/components/table/Table';
import Link from 'next/link';

interface Patient {
  id_paciente: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  estado: string;
}

const columns: ColumnHeader<Patient>[] = [
  { id: 'nombre', label: 'Nombre', className: 'p-2' },
  { id: 'apellido', label: 'Apellido', className: 'p-2' },
  { id: 'dni', label: 'DNI', className: 'p-2' },
  { id: 'telefono', label: 'Teléfono', className: 'hidden md:table-cell' },
  { id: 'direccion', label: 'Dirección', className: 'hidden md:table-cell' },
  { id: 'estado', label: 'Estado', className: 'hidden md:table-cell' },
];

const rows = [
  {
    id_paciente: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678',
    telefono: '987654321',
    direccion: 'Calle 123, Lima',
    estado: 'Activo',
  },
  {
    id_paciente: '2',
    nombre: 'María',
    apellido: 'Gómez',
    dni: '87654321',
    telefono: '912345678',
    direccion: 'Avenida 456, Arequipa',
    estado: 'Inactivo',
  },
];

const PatientPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold mb-4'>Pacientes</h1>
      <Table
        columns={columns}
        rows={rows}
        customRenderers={{
          nombre: (row) => <h3 className='font-semibold'>{`${row.nombre}`}</h3>,
          apellido: (row) => (
            <h3 className='font-semibold'>{`${row.apellido}`}</h3>
          ),
        }}
        customActions={(row) => (
          <div className='flex items-center gap-2'>
            <Link href={`/patients/${row.id_paciente}`}>
              <FormContainer table='paciente' type='view' />
            </Link>
            <FormContainer table='paciente' type='update' data={row} />
            <FormContainer
              table='paciente'
              type='delete'
              id={row.id_paciente}
            />
          </div>
        )}
      />
    </div>
  );
};

export default PatientPage;
