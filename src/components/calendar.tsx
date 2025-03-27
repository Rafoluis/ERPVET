"use client";

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("es");

const localizer = momentLocalizer(moment);

const messages = {
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    allDay: "Todo el día",
    week: "Semana",
    work_week: "Semana laboral",
    day: "Día",
    month: "Mes",
    today: "Hoy",
    previous: "Anterior",
    next: "Siguiente",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    agenda: "Agenda",
    noEventsInRange: "No hay eventos en este rango",
    showMore: (total: number) => `+ Ver más (${total})`,
};

const eventStyleGetter = (
    event: any,
    start: Date,
    end: Date,
    isSelected: boolean
) => {
    const style = {
        whiteSpace: "normal",
        overflow: "visible",
        height: "auto",
        lineHeight: "1.2em",
        padding: "2px",
    };

    return { style };
};

type CalendarView = "month" | "week" | "work_week" | "day" | "agenda";

interface BigCalendarProps {
    data: { title: string; start: Date | string | null; end: Date | string | null }[];
}

const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
        toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
        toolbar.onNavigate("NEXT");
    };

    const goToToday = () => {
        toolbar.onNavigate("TODAY");
    };

    const handleViewChange = (view: CalendarView) => {
        toolbar.onView(view);
    };

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button onClick={goToBack}>Anterior</button>
                <button onClick={goToToday}>Hoy</button>
                <button onClick={goToNext}>Siguiente</button>
            </span>
            <span className="rbc-toolbar-label">{toolbar.label}</span>
            <span className="rbc-btn-group">
                <button onClick={() => handleViewChange("week")}>Semana</button>
                <button onClick={() => handleViewChange("day")}>Día</button>
            </span>
        </div>
    );
};

const BigCalendar = ({ data }: BigCalendarProps) => {
    const parsedData = data
        .filter((event) => event.start !== null && event.end !== null)
        .map((event) => ({
            ...event,
            start: typeof event.start === "string" ? new Date(event.start) : event.start,
            end: typeof event.end === "string" ? new Date(event.end) : event.end,
        }));
    const minTime = new Date();
    minTime.setHours(6, 0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(21, 0, 0, 0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<CalendarView>("week");

    const handleNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    const handleViewChange = (newView: CalendarView) => {
        setCurrentView(newView);
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={parsedData}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                dayLayoutAlgorithm="no-overlap"
                eventPropGetter={eventStyleGetter}
                messages={messages}
                style={{ height: 500 }}
                min={minTime}
                max={maxTime}
                date={currentDate}
                view={currentView}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                components={{ toolbar: CustomToolbar }}
            />
        </div>
    );
};

export default BigCalendar;
