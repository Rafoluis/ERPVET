"use client";

import dynamic from "next/dynamic";

const BigCalendar = dynamic(() => import("./calendar"), { ssr: false });

interface CalendarClientProps {
    data: { title: string; start: Date | null; end: Date | null }[];
}

const CalendarClient = ({ data }: CalendarClientProps) => {
    return <BigCalendar data={data} />;
};

export default CalendarClient;