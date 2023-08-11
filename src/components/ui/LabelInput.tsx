"use client";

import { ChangeEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";

export const LabelInput = ({
  label,
  name,
  defaultValue,
  value,
  onChangeFn,
  loading,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  onChangeFn: (event: string) => void;
}) => {
  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { target } = evt;
    onChangeFn(target.value);
  };

  return (
    <div className="relative">
      <div className="absolute right-[10px] top-[51px]">
        <Spinner loading={loading} />
      </div>
      <label htmlFor={name}>{label}</label>
      <div className="mt-4 mb-8 grid grid-cols-[112px_auto] gap-8">
        <input
          name={`current-${name}`}
          autoComplete="none"
          type="text"
          disabled
          className="rounded border border-[#090D29] bg-[#0F1231] text-sm w-full h-[56px] pl-6 pr-4 focus:outline-none"
          value={`$ ${defaultValue}`}
        />
        <input
          onChange={onInputChange}
          id={name}
          name={name}
          autoComplete="off"
          className="rounded border border-[#2C305B] text-sm text-[7C7E96] bg-[#1A1E43] pl-6 pr-4 w-full h-[56px] focus:outline-none"
          disabled={loading}
          value={value}
        />
      </div>
    </div>
  );
};
