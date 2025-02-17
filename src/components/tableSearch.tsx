"use client"

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange, DateRangePicker } from "./date-picker/DatePicker";
import { es } from "date-fns/locale";
import { set } from "date-fns";

interface Props {
    withDateRange?: boolean;
}

const TableSearch = ( { withDateRange = true }: Props ) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
      )
    
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = (e.currentTarget[0] as HTMLFormElement).value;
        const params = new URLSearchParams(window.location.search);
        params.set("search", value);
        router.push(`${window.location.pathname}?${params}`);
    };

    const handleDateRangeChange = (dateRange: DateRange) => {
        const params = new URLSearchParams(window.location.search);
        setDateRange(dateRange);
        console.log(dateRange);
    }

    return (
        <>
             {
                withDateRange && ( <DateRangePicker
                    value={dateRange}
                    onChange={() => handleDateRangeChange}
                    className="w-60"
                    locale={es}
                  />
                )
            }
            <form onSubmit={handleSubmit}
                className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Search size={14} color="gray" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-[200px] p-2 bg-transparent outline-none"
                    />
            </form>
        </>
    );
}

export default TableSearch;