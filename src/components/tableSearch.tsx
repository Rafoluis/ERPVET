"use client"

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange, DateRangePicker } from "./date-picker/DatePicker";
import { es } from "date-fns/locale";

interface Props {
  withDateRange?: boolean;
}

const TableSearch = ({ withDateRange = true }: Props) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    router.push(`${window.location.pathname}?${params}`);
  };

  const updateUrlParam = (params: URLSearchParams, key: string, value: string) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  };

  const handleDateRangeChange = (dateRange?: DateRange) => {
    const params = new URLSearchParams(window.location.search);

    if (!dateRange) {
      params.delete("start");
      params.delete("end");
      setDateRange(undefined);
      router.push(`${window.location.pathname}?${params.toString()}`);
      return;
    }

    const formattedStart = dateRange.from
      ? dateRange.from.toISOString().split("T")[0]
      : "";
    const formattedEnd = dateRange.to
      ? dateRange.to.toISOString().split("T")[0]
      : "";

    updateUrlParam(params, "start", formattedStart);
    updateUrlParam(params, "end", formattedEnd);

    setDateRange(dateRange);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <>
      {withDateRange && (
        <DateRangePicker
          value={dateRange}
          onChange={(dateRange) => handleDateRangeChange(dateRange)}
          className="w-60"
          locale={es}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
      >
        <Search size={14} color="gray" />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </form>
    </>
  );
};

export default TableSearch;
