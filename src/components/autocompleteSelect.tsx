"use client";

import React from "react";
import Select, { SingleValue, Props as SelectProps } from "react-select";

export interface OptionType {
    value: number | string;
    label: string;
}

interface AutocompleteSelectProps {
    label: string;
    options: OptionType[];
    placeholder?: string;
    value: OptionType | null;
    onChange: (option: OptionType | null) => void;
    className?: string;
    isClearable?: boolean;
    filterOption?: SelectProps<OptionType>["filterOption"];
}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
    label,
    options,
    placeholder = "Seleccione",
    value,
    onChange,
    className = "w-full",
    isClearable = true,
    filterOption,
}) => {
    const defaultFilterOption: SelectProps<OptionType>["filterOption"] = (option, inputValue) => {
        if (!inputValue) return false;
        return option.label.toLowerCase().includes(inputValue.toLowerCase());
    };

    return (
        <div>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            <Select
                value={value}
                onChange={onChange}
                options={options}
                placeholder={placeholder}
                isClearable={isClearable}
                filterOption={filterOption || defaultFilterOption}
                className={className}
            />
        </div>
    );
};

export default AutocompleteSelect;