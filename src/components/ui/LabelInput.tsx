"use client";

import { ChangeEvent } from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { Spinner } from "@/components/ui/Spinner";

const defaultMaskOptions = {
  prefix: "$",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

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
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });

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
        <span className="rounded border border-[#5A5597] bg-[#38346A] text-[16px] text-white w-full h-[56px] leading-[56px] pl-6 pr-4 focus:outline-none">
          {defaultValue}
        </span>
        <MaskedInput
          mask={currencyMask}
          id={name}
          name={name}
          onChange={onInputChange}
          disabled={loading}
          value={value}
          className="rounded border border-[#1E1E1E] bg-white text-[16px] text-[#434343] pl-6 pr-4 w-full h-[56px] focus:outline-none"
          inputMode="decimal"
        />
      </div>
    </div>
  );
};
