import CitasCard from "@/app/components/citasCard"

const RecepcionPage = () => {
    return (
        <div className=''>
            {/* CARTAS CITAS */}
            <div className='flex gap-4 justify-between flex-wrap'>
                <CitasCard type='Citas totales' />
                <CitasCard type='Pacientes totales' />
                <CitasCard type='Próximas citas' />
            </div>
        </div>
    )
}

export default RecepcionPage