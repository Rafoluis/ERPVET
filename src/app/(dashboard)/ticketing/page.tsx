import Table from '@/app/components/table';
import TableSearch from '@/app/components/tableSearch';
import React from 'react';
import { renderRow } from '../list/appointments/page';

const COLUMNS = [
  {
    header: 'Fecha',
    accessor: 'fecha',
  },
  {
    header: 'Paciente',
    accessor: 'paciente',
  },
  {
    header: 'DNI',
    accessor: 'dni',
  },
  {
    header: 'Monto',
    accessor: 'monto',
  },
  {
    header: 'Tipo de comprobante',
    accessor: 'tipoComprobante',
  },
  {
    header: 'Metodo de pago',
    accessor: 'metodoPago',
  },
  {
    header: 'Acciones',
    accessor: 'acciones',
  },
];

const DATA = [
  {
    fecha: '12/12/2021',
    paciente: 'Juan Perez',
    dni: '12345678',
    monto: 'S/ 100.00',
    tipoComprobante: 'Boleta',
    metodoPago: 'Efectivo',
    acciones: 'Ver',
  },
  {
    fecha: '12/12/2021',
    paciente: 'Juan Perez',
    dni: '12345678',
    monto: 'S/ 100.00',
    tipoComprobante: 'Boleta',
    metodoPago: 'Efectivo',
    acciones: 'Ver',
  },
  {
    fecha: '12/12/2021',
    paciente: 'Juan Perez',
    dni: '12345678',
    monto: 'S/ 100.00',
    tipoComprobante: 'Boleta',
    metodoPago: 'Efectivo',
    acciones: 'Ver',
  }
]

const Ticketing = () => {
  return (
    <section>
      <div className='flex justify-between items-center'>
        <h1 className='p-4 hidden md:block text-lg font-semibold'>Boleteria</h1>

        <button className='px-4 bg-gray-400 text-white py-2 rounded hover:bg-gray-500'>
          Registrar nuevo pago
        </button>
      </div>

      <main className='p-4 flex-1 m-4'>
        <div className='flex justify-between items-center'>
          <h2 className='hidden md:block text-ls font-semibold'>
            Historial de pagos
          </h2>
          <TableSearch />
        </div>

        <div>
          <table className='w-full'>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.header} className='p-4'>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {DATA.map((row, index) => (
                <tr key={index}>
                  {COLUMNS.map((column) => (
                    <td key={column.header} className='p-4'>
                      {row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
};

export default Ticketing;
