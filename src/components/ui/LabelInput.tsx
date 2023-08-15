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
        <Spinner loading />
      </div>
      <label htmlFor={name}>{label}</label>
      <div className="mt-4 mb-8 grid grid-cols-[112px_auto] gap-8">
        <input
          name={`current-${name}`}
          autoComplete="none"
          type="text"
          disabled
          className="rounded border border-[#5A5597] bg-[#38346A] text-[16px] text-white w-full h-[56px] pl-6 pr-4 focus:outline-none"
          value={`$ ${defaultValue}`}
        />
        <input
          onChange={onInputChange}
          id={name}
          name={name}
          autoComplete="off"
          className="rounded border border-[#1E1E1E] bg-white text-[16px] text-[#434343] pl-6 pr-4 w-full h-[56px] focus:outline-none"
          disabled={loading}
          value={value}
        />
      </div>
    </div>
  );
};
