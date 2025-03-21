"use client"

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');

const localizer = momentLocalizer(moment);

const messages = {
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    allDay: 'Todo el día',
    week: 'Semana',
    work_week: 'Semana laboral',
    day: 'Día',
    month: 'Mes',
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    agenda: 'Agenda',
    noEventsInRange: 'No hay eventos en este rango',
    showMore: (total: number) => `+ Ver más (${total})`,
};

const eventStyleGetter = (
    event: any,
    start: Date,
    end: Date,
    isSelected: boolean
) => {
    const style = {
        whiteSpace: "normal", // Permite saltos de línea
        overflow: "visible",  // Evita que se oculte el texto sobrante
        height: "auto",       // Ajusta la altura según el contenido
        lineHeight: "1.2em",  // Mejora la legibilidad
        padding: "2px",
    };

    return {
        style,
    };
};


const BigCalendar = ({ data }: { data: { title: string; start: Date | null; end: Date | null; }[] }) => {
    const filteredData = data.filter(event => event.start !== null && event.end !== null) as { title: string; start: Date; end: Date; }[];

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={filteredData}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                dayLayoutAlgorithm="no-overlap"
                eventPropGetter={eventStyleGetter}
                messages={messages}
                style={{ height: 500 }}
                min={new Date(2025, 1, 0, 6, 0, 0)}
                max={new Date(2025, 1, 0, 21, 0, 0)}
            />
        </div>
    );
}

export default BigCalendar;
