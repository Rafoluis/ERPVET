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
        <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
                <div className="w-full md:w-1/2">
                    <InputField
                        label="Nombre de la Empresa"
                        name="companyName"
                        register={register}
                        error={errors.companyName}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <InputField
                        label="RUC"
                        name="ruc"
                        register={register}
                        error={errors.ruc}
                    />
                </div>

                <div className="w-full md:w-1/2">
                    <InputField
                        label="Dirección"
                        name="address"
                        register={register}
                        error={errors.address}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <InputField
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        register={register}
                        error={errors.phone}
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Logo</label>
                    <input
                        type="text"
                        placeholder="Ej: URL del logo"
                        {...register("logo")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    />
                </div>

                <div className="w-full md:w-1/2 flex justify-center items-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-auto"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>

    );
};

export default CompanyForm;
