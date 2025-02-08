import { FieldError } from "react-hook-form";

type InputFieldProps = {
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
const InputField = ({
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
}: InputFieldProps) => {
    return (
        <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full"}>
            <label className="text-xs text-gray-500">{label}</label>
            <input type={type}
                {...register(name)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...inputProps}
                {...(value !== undefined ? { value } : { defaultValue })}
                {...(onChange ? { onChange } : {})}
                {...(min !== undefined ? { min } : {})}
            />
            {error?.message && <p className="text-xs text-red-500">{error.message.toString()}</p>}
        </div>
    );
}

export default InputField