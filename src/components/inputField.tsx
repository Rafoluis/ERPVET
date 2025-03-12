import { FieldError } from "react-hook-form"

interface InputFieldProps {
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultValue?: string;
    value?: string;
    error?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    hidden?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min?: number;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    type = "text",
    register,
    name,
    defaultValue,
    error,
    inputProps,
    hidden,
    value,
    min,
    onChange,
}) => {
    return (
        <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full"}>
            <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                {...register(name)}
                type={type}
                id={name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...inputProps}
                {...(value !== undefined ? { value } : { defaultValue })}
                {...(onChange ? { onChange } : {})}
                {...(min !== undefined ? { min } : {})}
                aria-invalid={error ? "true" : "false"}
            />
            {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
        </div>
    )
}

export default InputField;
