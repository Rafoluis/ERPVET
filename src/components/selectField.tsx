import { Controller, Control, FieldError } from "react-hook-form"
import React from "react"

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    id: string;
    error?: FieldError;
    options: Option[];
    multiple?: boolean;
    control: Control<any>;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, error, options, multiple = false, control }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Controller
                name={id}
                control={control}
                render={({ field }) => (
                    <select
                        {...field}
                        id={id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        multiple={multiple}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value)
                            field.onChange(values)
                        }}
                        value={field.value || (multiple ? [] : "")}
                    >
                        {options.map((option: Option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            />
            {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
        </div>
    )
}

export default SelectField;
