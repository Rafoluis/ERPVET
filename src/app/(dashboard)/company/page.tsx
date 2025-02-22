"use client";

import InputField from "@/components/inputField";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type CompanyFormData = {
    companyName: string;
    ruc: string;
    address: string;
    phone: string;
    logo: string;
};

type CompanyFormProps = {
    onSubmit: SubmitHandler<CompanyFormData>;
};

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyFormData>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
                label="Nombre de la Empresa"
                name="companyName"
                register={register}
                error={errors.companyName}
            />

            <InputField
                label="RUC"
                name="ruc"
                register={register}
                error={errors.ruc}
            />

            <InputField
                label="Dirección"
                name="address"
                register={register}
                error={errors.address}
            />

            <InputField
                label="Teléfono"
                name="phone"
                type="tel"
                register={register}
                error={errors.phone}
            />

            {/* Campo de ejemplo para el logo */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-xs text-gray-500">Logo</label>
                <input
                    type="text"
                    placeholder="Ej: URL del logo"
                    {...register("logo")}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                />
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Enviar
            </button>
        </form>
    );
};

export default CompanyForm;
