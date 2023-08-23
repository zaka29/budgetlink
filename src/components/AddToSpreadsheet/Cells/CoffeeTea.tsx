"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { ChangeEvent, Dispatch, useEffect, useState, useRef } from "react";
import {
  Actions,
  ActionTypes,
} from "@/components/AddToSpreadsheet/AddToSpreadsheet";
import { useGetCellValue } from "@/app/hooks";
import { CELLS } from "@/app/actions";

export const CoffeeTea = ({
  onChangeFunc,
  dispatch,
  coffeetea,
}: {
  onChangeFunc: (evt: ChangeEvent<HTMLInputElement>) => void;
  dispatch: Dispatch<Actions>;
  coffeetea?: { total: string | null; expense: string | null };
}) => {
  const [displayTotal, setDisplayTotal] = useState("0.00");
  const [expense, setExpense] = useState("0.00");

  const { data, loading } = useGetCellValue(CELLS.coffeetea);
  const { total } = coffeetea || {};

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setExpense(value);
    onChangeFunc(evt);
  };

  useEffect(() => {
    if (total) {
      setDisplayTotal(total);
      setExpense("0.00");
    }
  }, [total]);

  useEffect(() => {
    if (data) {
      const { sheets } = data;
      setDisplayTotal(sheets.title);
      dispatch({
        type: ActionTypes.UPDATE_EXPENSE_TOTAL,
        payload: { name: "coffeetea", total: sheets.title },
      });
    }
  }, [data]);

  return (
    <LabelInput
      label="Total coffee and tea"
      name="coffeetea"
      onChangeFn={handleChange}
      defaultValue={displayTotal}
      value={expense}
      loading={loading}
    />
  );
};
