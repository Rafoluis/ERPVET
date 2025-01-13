const AppointmentCard = ({ type }: { type: string }) => {
    return (
        <div className="rounded-2xl bg-gray-200 p-4 flex-1 min-w-[130px]">
            <h1 className="text-2xl font-semibold my-2">100</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
        </div>
    )
}

export default AppointmentCard