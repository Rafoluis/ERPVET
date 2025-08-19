// components/SingleMascotasClient.tsx
"use client";

import Image from 'next/image';
import { useState } from 'react';
import {
  Calendar,
  ScanBarcode,
  Dog,
  PawPrint,
  Stethoscope,
  CheckCircle,
  Plus,
} from 'lucide-react';
import Historia from '@/components/Historia';
import TimelineSwitcher from '@/components/timeline/timeLineSwitcher';
import FormContainer from './formContainer';

interface Consulta {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  detalles: string[];
}

interface VaccineRecord {
  idRegistroVacuna: number;
  nombreVacuna: string;
  fechaAdministracion: string;
}

interface Props {
  mascota: {
    idMascota: number;
    nombre: string;
    fechaNacimiento: string;
    numeroChip: string | null;
    raza: string | null;
    especie: string;
    urlfoto: string | null;
    propietario: {
      nombre: string;
      apellido: string;
      dni: string;
    };
  };
  consultas: Consulta[];
  vacunaciones: VaccineRecord[];
  historia: {
    idHistoriaClinica: number;
    idMascota: number;
    color: string;
    tamaño: string;
    señalesParticulares: string;
    finZootecnico: string;
    origenProcedencia: string;
    alimentacion: string;
    habitad: string;
    viajesRecientes: string;
    convivencia: string;
    comportamiento: string;
    enfermedadPrevia: string;
    partos: number;
    viveConAnimales: boolean;
    previasEnfermedades: { id: number; descripcion: string; fecha: string }[];
    previasCirugias: { id: number; descripcion: string; fecha: string }[];
    tratamientosRecientes: { id: number; descripcion: string; fechaInicio: string; fechaFin: string }[];
  } | null;
}

export default function SingleMascotasClient({
  mascota,
  consultas,
  vacunaciones,
  historia,
}: Props) {
  const [mode, setMode] = useState<'consultas' | 'vacunacion'>('consultas');

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* Panel izquierdo */}
      <div className="w-full xl:w-2/3">
        {/* Header con foto y datos */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-backgrounddefault py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={mascota.urlfoto || '/noAvatar.png'}
                alt={`${mascota.nombre}`}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{mascota.nombre}</h1>
              <p className="text-sm text-gray-500">
                Propietario: {mascota.propietario.nombre}{' '}
                {mascota.propietario.apellido} ({mascota.propietario.dni})
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    {new Date(mascota.fechaNacimiento).toLocaleDateString(
                      'es-PE',
                      { timeZone: 'UTC' }
                    )}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <ScanBarcode size={16} />
                  <span>{mascota.numeroChip ?? '-'}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Dog size={16} />
                  <span>{mascota.raza ?? '-'}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <PawPrint size={16} />
                  <span>{mascota.especie}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Calendar size={24} className="text-gray-600" />
              <div>
                <h1 className="text-xl font-semibold">{consultas.length}</h1>
                <span className="text-sm text-gray-500">Número de consultas</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Stethoscope size={24} className="text-gray-600" />
              <div>
                <h1 className="text-xl font-semibold">
                  {consultas.length
                    ? new Date(
                        consultas[consultas.length - 1].fecha
                      ).toLocaleDateString('es-PE', { timeZone: 'UTC' })
                    : '-'}
                </h1>
                <span className="text-sm text-gray-500">Última consulta</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <CheckCircle size={24} className="text-gray-600" />
              <div>
                <h1 className="text-xl font-semibold">
                  {vacunaciones.length
                    ? new Date(
                        vacunaciones[vacunaciones.length - 1].fechaAdministracion
                      ).toLocaleDateString('es-PE', { timeZone: 'UTC' })
                    : '-'}
                </h1>
                <span className="text-sm text-gray-500">
                  Última vacunación
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline y botón “Agregar” */}
        <div className="mt-4 bg-white rounded-md p-4 h-[550px] overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h1 className="text-xl">
              Historial de {mode === 'consultas' ? 'consultas' : 'vacunación'}
            </h1>

            {historia ? (
              <FormContainer
                table={mode === 'consultas' ? 'timeline' : 'registroVacunacion'}
                type="create"
                id={
                  mode === 'consultas'
                    ? historia.idHistoriaClinica
                    : mascota.idMascota
                }
              />
            ) : (
              <button
                disabled
                title="Crea primero la historia clínica"
                className="flex items-center gap-2 bg-gray-300 text-white text-sm px-4 py-2 rounded-md cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            )}
          </div>

          <div className="flex flex-col justify-center items-center text-base pb-8 sm:text-lg">
            <TimelineSwitcher
              defaultColor="bg-cyan-500"
              consultas={consultas}
              vacunaciones={vacunaciones}
              mode={mode}
              onModeChange={setMode}
            />
          </div>
        </div>
      </div>

      {/* Panel derecho con la sección de Historia */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Historia idMascota={mascota.idMascota} historia={historia} />
      </div>
    </div>
  );
}
