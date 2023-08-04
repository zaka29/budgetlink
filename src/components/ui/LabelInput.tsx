"use client";

import { ChangeEvent } from "react";

export const LabelInput = ({
  label,
  name,
  onChangeFn,
}: {
  label: string;
  name: string;
  onChangeFn: (event: string) => void;
}) => {
  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { target } = evt;
    onChangeFn(target.value);
  };
  return (
    <div>
      <label htmlFor={name} className="pb-4">
        {label}
      </label>
      <div className="mt-2 pb-4">
        <input
          onChange={onInputChange}
          id={name}
          name={name}
          className="rounded border border-gray-800 p-3 bg-gray-500 text-sm text-gray-900"
        />
      </div>
    </div>
  );
};
